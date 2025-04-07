Polished Recap: Building a React Frontend with Database Integration
Step 1: Create a React Project
Of course, create a React project using npx create-react-app <app-name> or npx create-react-app . if you’re already inside the folder where you want to create your project.

Step 2: Install React Router
Install react-router-dom using npm install react-router-dom. This one is very important—without it, you won’t be able to do anything navigation-related in your app.

Step 3: Start Building Your Frontend
Okay, now you begin creating your website (frontend). First, you need a header and a footer, and the pages will be between them since the header and footer never change across routes.

Step 4: Choose a Routing Method
You can use the <Route/> method that I mentioned in my other note, or the better mode that doesn’t need to use useState to get your data, which is the <RouterProvider/> method.

Step 5: Create Header and Footer Components
Create the <Header/> and <Footer/> components inside a components folder (e.g., src/components).

Step 6: Set Up Routing in App.js
Okay, inside App.js, you’re going to create the main thing. You first create a function and name it, for example, router, and you assign it a react-router-dom element called createBrowserRouter, which takes an array. Inside that array, you open an object. Inside that object, you will have 3 keys to start: path, element, and children.
The "path" key: Put the home path, for example, "/".

The "element" key: Open parentheses, then inside, use an empty fragment (<> </>) and put inside it 3 components: <Header/>, then <Outlet/>, then <Footer/> (after creating the header and footer components, of course).

The "children" key: Inside this one, you will be putting the whole thing here—all the other pages. You open an array, and inside it, every page you will use will be inside an object with two keys: path and element (same story). Begin by adding the Hero component and the About component just to fix your website for the rest. Then, return <RouterProvider router={router} />.

Here’s the code:
javascript

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      ),
      children: [],
    },
  ]);

  return <RouterProvider router={router} />;
}

Step 7: Create Initial Components
Create the Signup, Signin, and Products components as a beginning. Put them all inside the children array in App.js.

Step 8: Connect React to the Database
Okay, now we’re going to fill the Products page with products from my database. First, you need to connect our React project to our database. Install cors inside the backend folder using npm install cors and use this in the backend server.js: app.use(cors({ origin: "http://localhost:3000" }));.

Step 9: Create an API Helper File
A side note: To make everything easier for us, we better create a new file called, for example, Api.js, and inside it, we put all the functions that we’re going to use to connect our React frontend with our backend—like the add user function, delete product, get all products, log in, etc.

Step 10: Fetch and Display Products
After creating that file, and since we want to get all products, we go to that Api.js file and we create (and export, of course) a function called getProducts (async, of course, with try and catch). Inside each function in that file, you have to return the response.data (what we called it in the res.status(200) inside the backend). Now, we go to App.js and inside the children array, in the object where <Products/> exists, add a third key called loader: getProducts (depending on what you called the function inside Api.js).

Now, we go to Products.jsx, and the first thing to do is create a const for the products we sent for inside the loader. Create a const and assign the react-router-dom element called useLoaderData().

Okay, now after that, you bring a ready-to-use card from Tailwind, for example (or any other website that offers ready-to-use components), then you use .map on it.

Now, if you want to get a single product after clicking on one of the product cards in your website, you wrap that card inside <Link></Link> and then you add to={} inside the first <Link> tag. (This is an example: to={"/prod/" + product._id}, where product is what you put as the element inside the map function.) After this, we go immediately to create the <SingleProduct/> component where we will be getting one product card on a page.

Since we used to={"/prod/" + product._id}, and after creating <SingleProduct/>, you go add it in App.js like this: { path: "/prod/:id", element: <SingleProduct /> }. The :id will take that product._id.

Okay, now we go to Api.js and we create and export a new function called, for example, getOneProduct, and inside the parameters, we put { params } (because we want to get what’s inside the website link—we want that :id). Then, inside that axios call, you use the link you used for your backend (something like this: const response = await axios.get(${apiUrl}/One/${params.id})), and of course, you return the response. Then, now you go to App.js and you go to the <SingleProduct/> object and you add the loader to it: { path: "/prod/:id", element: <SingleProduct />, loader: getOneProduct }.

Okay, now we go to the SingleProduct.jsx component, then you just create a const and you assign useLoaderData() to it. Then, use console.log to know what you have and just play with it. From this page, you can add your stuff to the cart or whatever—just use your brain on this one.

Step 11: Build the Dashboard
Okay, now for the dashboard, we go create the Dashboard.jsx file and divide it into two: left side and right side. Now, go to App.js and you add the object of <Dashboard/> inside it, and you add a third key in it called children since we’re going to use a few pages in the dashboard. Same thing—inside children, you open an array, and inside it, you open the objects of the pages you’re going to use there. Okay, you go create a ProductsDash.jsx and put the products inside it like this: { index: true, element: <ProductsDash cart={cart} setCart={setCart} />, loader: getProducts }.

You create a form page in the dashboard too, where you can add a new product to your database. In this one, we’re going to use the useRef() method. You go to the input of each one and you add ref={nameRef}, for example, then you go up and you create a const called nameRef and you assign useRef() to it—same thing for the rest of the inputs. Then, you check the schema you have inside your backend (the schema of the products), then you create a newProduct with, for example, the first key title with nameRef.current.value inside it.

Okay, now there’s a trick: For the image part, you change the type of the input to "file" and you add another attribute called accept="image/*", and you add another one called multiple (this one if you want to upload more than one picture—delete it if you want to upload just one picture). CLOUDINARY: (Most of the work will be inside an async add function.) First, you go create an empty array and you call it imageLinks, for example. Then, with a for loop, you loop through the newProduct.images that you uploaded from your form. Basically, do this:
javascript

const imageLinks = [];
for (let i = 0; i < newProd.images.length; i++) {
  console.log(newProd.images[i]);
  const formData = new FormData();
  formData.append("upload_preset", "seiffff");
  formData.append("file", newProd.images[i]);
  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dfwxnlpjb/upload",
    formData
  );
  console.log(res);
  imageLinks.push(res.data.secure_url);
}

Now, you can add your new product using axios.post.

PS: You can use toast as a way to show notifications—don’t forget to add <ToastContainer /> in App.js.

Step 12: Implement Signup
Now for the signup part, you create the Signup component, you call it, and you use it in App.js, of course. Now, you go to the component. Now, we get the values from the form using another method—using the state method. Create a state, and inside the useState, you put what you want with their initial values. Then, you go to, for example, the name input and you use the onChange function, and you add the e, of course, since we’re working inside a form. Then, you use the setNewUser from the state you created. Inside it, open an object and spread ...newUser from the state, then you add name: e.target.value (same with the rest). Then, you create your new user with axios and you know the rest.

Step 13: Implement Login with Cookies
Now for the login, create the component, add it to App.js. Go to the component and: Get the form info with the same method from step 12. Use axios.post to the same path from the backend, add newUser to the body (after the path inside the axios), and then add the object withCredentials: true (for the cookie). If the response is 200, proceed accordingly.

Cookie Setup
The cookie part: First, go to the backend and install cookie-parser. Require it inside a const in server.js, then app.use that const(). And then, you add these credentials: app.use(cors({ origin: "http://localhost:3000", credentials: true }));. Now, in the backend, in the signup function, you don’t send the token in the res.status(200)—you do that when you’re using localStorage. But now we’re using cookies, so you do something like this:
javascript

res.cookie("token", token, {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

After creating the token, of course. Same thing with the login and any function that sends the token to the frontend. Now, whenever you’re trying to send something from the frontend to the backend that requires checking the token, you will have to add withCredentials: true in the part after the body of axios. This is how you receive the token from the frontend in cookies mode: const token = req.cookies.token;.

Important Functions: getCurrent and isAuth
A very important function is getCurrent and isAuth. These two you will need a lot when trying to get the current user. So, whenever you need anything from that user—like a cart (panier), for example, or images—you will have to load that getCurrent function, then use something like this: const { panier } = useLoaderData();.

