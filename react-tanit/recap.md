# Building a React Frontend with Database Integration

## Step 1: Create a React Project

Start by creating a React project using the following command:

- `npx create-react-app <app-name>` to create a new project, or
- `npx create-react-app ./` if you're already in the desired folder.

## Step 2: Install React Router

Install `react-router-dom` for navigation:

- Run `npm install react-router-dom`. This is essential for handling routing in your app.
  (dont forget to install tailwind )

## Step 3: Start Building Your Frontend

Begin constructing the frontend:

- Create a `<Header/>` and `<Footer/>` component. These will remain constant across routes, with page content displayed between them.

## Step 4: Choose a Routing Method

Select a routing approach:

- Use the `<Route/>` component, or the : `<RouterProvider/>` method, which simplifies data fetching without relying on `useState`.

## Step 5: Create Header and Footer Components

Set up reusable components:

- Create `<Header/>` and `<Footer/>` inside a `src/components` folder.

## Step 6: Set Up Routing in App.js

Configure routing in `App.js`:

- Define a `router` function using `createBrowserRouter` from `react-router-dom`.
- Pass an array with an object containing:
  - `path: "/"` (home route),
  - `element: <> <Header /> <Outlet /> <Footer /> </>` (layout with `Outlet` for page content),
  - `children: []` (array for nested routes).
- Return `<RouterProvider router={router} />`.

Example:

```javascript
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
```

## Step 7: Create Initial Components

Build core components:

- Create `Signup`, `Signin`, and `Products` components.
- Add them to the `children` array in `App.js`.

## Step 8: Connect React to the Database

Link your frontend to a backend database:

- In the backend, install `cors` with `npm install cors`.
- In `server.js`, add: `app.use(cors({ origin: "http://localhost:3000" }));`.

## Step 9: Create an API Helper File

Simplify API calls:

- Create `Api.js` in the `src` folder.
- Define and export functions like `addUser`, `deleteProduct`, `getProducts`, and `login` to connect the frontend and backend.

## Step 10: Fetch and Display Products

Populate the `Products` page:

- In `Api.js`, create an async `getProducts` function with `try/catch`, returning `response.data`.
- In `App.js`, add `loader: getProducts` to the `Products` route in the `children` array.
- In `Products.jsx`:
  - Use `const products = useLoaderData()` to access fetched data.
  - Map over `products` with a Tailwind card component.
- For single product views:
  - Wrap cards in `<Link to={"/prod/" + product._id}>`.
  - Add `{ path: "/prod/:id", element: <SingleProduct />, loader: getOneProduct }` to `App.js`.
  - In `Api.js`, create `getOneProduct({ params })` using `axios.get(`${apiUrl}/One/${params.id}`)`.
  - In `SingleProduct.jsx`, use `useLoaderData()` to display the product.

## Step 11: Build the Dashboard

Create an admin dashboard:

- In `Dashboard.jsx`, split the layout into left and right sections.
- In `App.js`, add `{ path: "/dashboard", element: <Dashboard />, children: [] }`.
- Inside `children`, add:
  - `{ index: true, element: <ProductsDash cart={cart} setCart={setCart} />, loader: getProducts }`.
- For adding products:
  - Create a form in `ProductsDash.jsx` using `useRef()` for inputs (e.g., `ref={nameRef}`).
  - For images, use `<input type="file" accept="image/*" multiple />`.
  - Upload to Cloudinary:
    ```javascript
    const imageLinks = [];
    for (let i = 0; i < newProd.images.length; i++) {
      const formData = new FormData();
      formData.append("upload_preset", "seiffff");
      formData.append("file", newProd.images[i]);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dfwxnlpjb/upload",
        formData
      );
      imageLinks.push(res.data.secure_url);
    }
    ```
  - Use `axios.post` to save the product.
- Add `<ToastContainer />` in `App.js` for notifications.

## Step 12: Implement Signup

Set up user registration:

- In `Signup.jsx`:
  - Use `useState` to manage form data (e.g., `[newUser, setNewUser] = useState({ name: "", ... })`).
  - On input change: `setNewUser({ ...newUser, name: e.target.value })`.
  - Submit with `axios.post` to the backend.

## Step 13: Implement Login with Cookies

Add user login:

- In `Signin.jsx`:
  - Use `useState` for form data (similar to Signup).
  - Use `axios.post(url, newUser, { withCredentials: true })` to send credentials.
- Backend setup:

  - i (`npm install cookie-parser`).
  - In `server.js`:
    ```javascript
    const cookieParser = require("cookie-parser");
    app.use(cookieParser());
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    ```
  - Set cookies in signup/login routes:
    ```javascript
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    ```
    res.clearCookie("token", { httpOnly: true, secure: true }); (when u want to delete the cookies,u need to create a log out function ofc in the backend  )
  - const token = req.cookies.token: (u call for the oken from cookies in isAuth )
    const verify = jwt.verify(token, secretKey);

- Frontend API calls requiring authentication:
  - Add `{ withCredentials: true }` to `axios` requests.
- Useful functions:
  - In `Api.js`, create `getCurrent` and `isAuth` to fetch user data (e.g., cart).
  - Use `const { panier } = useLoaderData()` in components.

```

```
