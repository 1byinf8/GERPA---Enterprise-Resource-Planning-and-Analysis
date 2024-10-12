const express = require('express');
const mysql = require('mysql2'); // Assuming you'll use MySQL for authentication
const path = require("path");
const bodyParser = require("body-parser");
const session = require('express-session'); 
const ejs = require('ejs');// Import express-session
const { table } = require('console');

const app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // Fix the typo here (missing closing parenthesis)
app.use(bodyParser.json());

// ... rest of your code

let admin = false;
let val,locked;

// Replace with your actual MySQL connection details
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'kashyap',
  database: 'company1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection (optional)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL');
    connection.release();
  }
});

// Configure session middleware
app.use(session({
  secret: 'your_very_strong_secret_key_here', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true for https only
}));

app.get("/", (req, res) => {
  if (req.session.user) {
    // User is already logged in, redirect to a different route (optional)
    res.redirect('/home');
  } else {
    res.sendFile(path.join(__dirname, "public", "signin.html"));
  }
});


const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

async function checkLoginAttempts(userId) {
  const [rows] = await pool.promise().query(
    'SELECT COUNT(*) AS attempt_count FROM failedlogins WHERE email = ? AND timestamp > DATE_SUB(CURDATE(), INTERVAL ? MINUTE)',
    [userId, LOCKOUT_DURATION / (60 * 1000)]
  );
  return rows[0].attempt_count;
}

async function insertFailedLogin(userId) {
  await pool.promise().query('INSERT INTO failedlogins (email, timestamp) VALUES (?, ?)', [userId, new Date()]);
}

async function clearFailedLogins(userId) {
  await pool.promise().query('DELETE FROM failedlogins WHERE email = ?', [userId]);
}

async function isUserLocked(userId) {
  const attemptCount = await checkLoginAttempts(userId);
   if (attemptCount >= MAX_ATTEMPTS) {
     await pool.promise().query('update  users set is_locked=1 WHERE email = ?', [userId]);
     return true;
   }
}


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body.email);

  // Validate email and password (add validation logic here)
  if (!email || !password) {
    return res.status(400).send("Invalid email or password");
  }

  // Replace with your actual query to check for user credentials
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  try {
    const [rows] = await pool.promise().query(query, [email, password]);
    if(rows.length>0) {
    (rows[0].is_admin==1) ? admin=true : admin=false;
    console.log(admin);
    locked = rows[0].is_locked;
    }
    else { locked=0;}

    if (await isUserLocked(email) || locked==1) {
      return res.send("<h1> Account has been Locked please contact your organisation admin");
    }
    

    if (rows.length === 1) {
      // Login successful
      req.session.user = { email: email }; // Store user data in session
      console.log("Login successful for user:", email);
      await clearFailedLogins(email);
      res.redirect('/'); // Redirect to a different route after login (optional)
    } else {
      await insertFailedLogin(email);
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal server error");
  }
});

app.get('/home', async (req, res) => {
  if(admin) {
    const userEmail = req.session.user.email;
    const query = `select * from employee where employeemail=?`;
    const query2 = `select count(*) as count from purchase`;
    const query3 = `select count(*) as count from orders`;
    const query4 =  `SELECT COUNT(DISTINCT category) AS total_categories FROM product`;
    const query5 = `SELECT COUNT(*) AS total_customers from customer`;
    const query6 = `select * from orders ORDER BY orderdate DESC`;
    const query7 = `SELECT m.*, e.employeename AS sender_username
FROM messages AS m
INNER JOIN employee AS e ON m.senderid = e.employeeid
WHERE m.recieverid = (
  SELECT employeeid FROM employee WHERE employeemail = 'jfoden3@tumblr.com'
)`;
    try {
      const [results] = await pool.promise().query(query, [userEmail]);
      const [results2] = await pool.promise().query(query2);
      const [results3] = await pool.promise().query(query3);
      const [results4] = await pool.promise().query(query4);
      const [results5] = await pool.promise().query(query5);
      const [results6] = await pool.promise().query(query6);
      const [results7] = await pool.promise().query(query7);
      val=results;
      res.render(path.join(__dirname, "public", "home.ejs"), { data: results , purchase:results2,order:results3,cat:results4,customer:results5,table:results6,msg:results7});
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Internal server error");
    }
  }
  else {
    const userEmail = req.session.user.email;
    const query = `select * from employee where employeemail=?`;
    const query2 = `select count(*) as count from product`;
    const query3 = `select count(*) as count from orders`;
    const query4 = `SELECT * FROM company1.orders where employeeid=(select employeeid from employee where employeemail=?)`;
    try {
      const [results] = await pool.promise().query(query, [userEmail]);
      const [results2] = await pool.promise().query(query2);
      const [results3] = await pool.promise().query(query3);
      const [results4] = await pool.promise().query(query4,[userEmail]);
      res.render(path.join(__dirname, "public", "emp.ejs"), { data: results , product:results2,order:results3,table:results4});
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Internal server error");
    }
  }
});

app.get("/products", async(req,res) => {
  if(admin) {
  const userEmail = req.session.user.email;
  const query1 =  `SELECT count(*) as count From product`;
  const query2 = `SELECT count(*) as count FROM supplier;`;
  const query3 = `select * from employee where employeemail=?`;
  const query4 = `select * from supplier`;
  const query5 = 'select * from purchase order by purchaseid desc';
  try {
    const [results1] = await pool.promise().query(query1);
    const [results2] = await pool.promise().query(query2);
    const [results3] = await pool.promise().query(query3,[userEmail]);
    const [results4] = await pool.promise().query(query4);
    const [results5] = await pool.promise().query(query5);
    res.render(path.join(__dirname,"public","products.ejs"),{data1:results1,data2:results2,data3:results3,table1:results4,table2:results5});
  } catch(error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Internal server error");
  }
}
else {
  res.render(path.join(__dirname,"public","locked.ejs"),{data:val});
}
});

app.get("/customers", async(req,res) => {
    if(admin) {
    const userEmail = req.session.user.email;
    const query = `select * from employee where employeemail=?`;
    const query2 =  `select * from customer`;
    try {
      const [results] = await pool.promise().query(query,[userEmail]);
      const [results1] = await pool.promise().query(query2);
      res.render(path.join(__dirname,"public","customers.ejs"),{data:results,table:results1});
    }  catch(error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Internal server error");
    }
    }
    else {
      res.render(path.join(__dirname,"public","locked.ejs"),{data:val});
    }
});

app.get("/employees", async(req,res) => {
  const userEmail = req.session.user.email;
  const query = `select * from employee where employeemail=?`;
  const query2 =  `select * from employee`;
  try {
    const [results] = await pool.promise().query(query,[userEmail]);
    const [results1] = await pool.promise().query(query2);
    res.render(path.join(__dirname,"public","employees.ejs"),{data:results,table:results1});
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/insights", async(req,res)=> {
  if(admin) {
  res.sendFile(path.join(__dirname,"public","insights.html"));
  }
  else {
    res.render(path.join(__dirname,"public","locked"),{data:val});
  }
});

app.get("/chart_home", async(req,res) => {
    const query = `select * from product`;
    const query2 = `SELECT productid, SUM(totalamount) AS totalExpens FROM purchase GROUP BY productid;`;
    const query3 = `SELECT productid, SUM(totalamount) AS totalSales FROM company1.orders GROUP BY productId`;
    const query4 = `SELECT category, sum(quantity) AS productCount FROM company1.product GROUP BY category`;
    try {
      const [results] = await pool.promise().query(query);
      const [results2] = await pool.promise().query(query2);
      const [results3] = await pool.promise().query(query3);
      const [results4] = await pool.promise().query(query4);
      res.json({results,results2,results3,results4})
    }  catch(error) {
      console.error("Error fetching user data:", error);
      res.status(500).send("Internal server error");
    }
}); 

app.get("/chart_products", async(req,res) => {
  const query = `SELECT
  s.supplierid,
  s.name AS supplier_name,
  sum(purchasequantity) AS purchase_count
  FROM purchase p
  LEFT JOIN supplier s ON p.supplierid = s.supplierid
  GROUP BY s.supplierid, s.name`;
  const query2 = `SELECT category, count(*) AS productCount FROM company1.product GROUP BY category`;
  try {
    const [results] = await pool.promise().query(query);
    const [results1] = await pool.promise().query(query2);
    res.json({results,results1});
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/chart_customers", async(req,res) => {
  const query1 = `SELECT c.name, COUNT(o.orderid) AS total_orders, SUM(oi.totalamount) AS total_spent
FROM customer c
INNER JOIN orders o ON c.customerid = o.customerid
INNER JOIN orders oi ON o.orderid = oi.orderid
GROUP BY c.name
ORDER BY total_orders DESC`;
  try {
    const [results] = await pool.promise().query(query1);
    res.json({results});
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/chart_employees", async(req,res) => {
  const query= `SELECT employeename,noofsales FROM company1.employee`;
  try {
    const [results] = await pool.promise().query(query);
    res.json({results});
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/chart_insights", async(req,res) => {
  const query = `SELECT 
  p.name as productName,
  s.name as supplierName,
  p.quantity,
  p.price
  FROM product p
  INNER JOIN product i ON p.productid = i.productid
  INNER JOIN supplier s ON i.supplierid = s.supplierid`;
  const query2 = `select * from orders`;
  const query3 = `SELECT * FROM company1.product`;
  const query4 = `SELECT * FROM company1.purchase`;
  const query5 = `SELECT * FROM company1.employee order by noofsales desc`;
  const query6 = `SELECT c.category, COUNT(p.productid) AS num_products
FROM product p
INNER JOIN product c ON p.category = c.category
GROUP BY c.category`;
  try {
    const [results] = await pool.promise().query(query);
    const [results2] = await pool.promise().query(query2);
    const [results3] = await pool.promise().query(query3);
    const [results4] = await pool.promise().query(query4);
    const [results5] = await pool.promise().query(query5);
    const [results6] = await pool.promise().query(query6);
    res.json({results,results2,results3,results4,results5,results6});
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/locked",async(req,res) => {
  const userEmail = req.session.user.email;
  const query = `select * from employee where employeemail=?`;
  try {
    const [results] = await pool.promise().query(query, [userEmail]);
    res.render(path.join(__dirname,"public","locked.ejs"),{data:results});
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/chart_home_admin", async(req,res) => {
  const query = `
SELECT
	p.name,
    COUNT(o.orderid) AS number_of_orders
FROM
    orders o
JOIN
    employee e ON o.employeeid = e.employeeid
JOIN
    product p ON o.productid = p.productid
GROUP BY
    e.employeeid, e.employeename, p.productid, p.name
ORDER BY
    e.employeeid,p.productid`;
    const query1= `SELECT employeename,noofsales FROM company1.employee`;
  try {
    const [results] = await pool.promise().query(query);
    const [results2] = await pool.promise().query(query1);
    res.json({results,results2});
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }

});

app.get("/empproduct", async(req,res) => {
  const query = `select * from product`;
  const userEmail = req.session.user.email;
  const query2 = `select * from employee where employeemail=?`;
  try {
    const [results] = await pool.promise().query(query);
    const [results1] = await pool.promise().query(query2,[userEmail]);
    res.render(path.join(__dirname,"public","empproduct.ejs"),{data:results1,table:results});
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
})

app.post("/add-purchase", async(req,res) => {
  console.log(req.body);
  const query=  `insert into purchase values (${req.body.purchaseId},${req.body.productId},${req.body.supplierId},${req.body.purchaseQuantity},${req.body.purchasePrice},current_date(),${req.body.toatlAmount})`;
  try {
    const [results] = await pool.promise().query(query);
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
  res.redirect("/products");
})

app.post("/add-product", async(req,res) => {
  console.log(req.body);
  const query=  `insert into product values (${req.body.purchaseId},${req.body.productId},${req.body.supplierId},${req.body.purchaseQuantity},${req.body.purchasePrice},${req.body.purchaseDate},${req.body.toatlAmount})`;
  try {
    const [results] = await pool.promise().query(query);
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
  res.redirect("/products");
})

app.post("/add-order", async(req,res) => {
  console.log(req.body);
  const query=  `insert into orders values (${req.body.orderId},${req.body.customerId},${req.body.productId},${req.body.employeeId},current_date(),${req.body.productPrice},${req.body.quantity},${req.body.toatlAmount})`;
  try {
    const [results] = await pool.promise().query(query);
  }  catch(error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Internal server error");
  }
  res.redirect("/home");
})

app.listen(PORT, () => {
  console.log(`Server is running on http://loalhost: ${PORT}`);
});
