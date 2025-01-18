import React from "react";
import { Typography } from "@mui/material";
import { ReactComponent as Rt } from "../assets/react.svg";
import { ReactComponent as No } from "../assets/nodejs.svg";
import { ReactComponent as Ex } from "../assets/express.svg";
import { ReactComponent as Md } from "../assets/mongodb.svg";
const Home = () => {
  return (
    <div className="pageContent">
      <Typography variant="h3" gutterBottom>
        Home
      </Typography>

      <Typography variant="body1" gutterBottom>
        This website is created as a pet project using MERN stack technologies.
        It includes both a client-side and server-side, and can be adapted to
        meet the real requirements of a customer for a full-fledged e-commerce
        platform.
        <hr
          style={{
            borderTop: "1px solid #666666",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        />
        <Typography variant="h5"> Client-side:</Typography> The client is built
        using the React <Rt></Rt> library. React-Redux is used for state
        management. MUI library is used for UI components. Axios is used for
        server communication. SASS is used for styling.{" "}
        <Typography variant="h6">Header:</Typography>
        Clicking on a menu item redirects the user to the corresponding page.
        Authenticated users have access to the profile page and logout
        component. If the profile name is "ADMIN", the admin page opens. For
        other users, this page is inaccessible. The mobile version of the site
        is triggered by clicking the burger menu and has the same functionality.
        <Typography variant="h6">Registration and Login Page:</Typography> When
        submitting the registration form, a request is sent to the server to
        create or retrieve the user from the database. The server returns user
        data and stores it in local storage, which interacts with Redux. Login
        via Google account is also possible, in which case the user's photo is
        displayed.
        <Typography variant="h6">Store Page:</Typography> Products are fetched
        from the database via the server. The products are filtered on the
        client-side and displayed 10 per page. Filtering by price, category, and
        additional criteria such as color, manufacturer, etc., is possible. A
        sample of popular products is displayed in a SWIPER slider. Search
        functionality can be implemented by product name or other criteria.
        <Typography variant="h6">Contact Page:</Typography>
        The form sends a request to the server, which then sends an email to the
        website's email address.{" "}
        <Typography variant="h6">Cart Page:</Typography> The cart has standard
        functionality with the ability to place an order and save the order data
        in the order journal on the admin page.{" "}
        <Typography variant="h6">Admin Page:</Typography>This page contains tabs
        for viewing and editing products, categories, and viewing the order
        journal. Additional functionality can be added upon customer request.
        <hr
          style={{
            borderTop: "1px solid #666666",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        />
        <Typography variant="h5"> Server-side:</Typography>
        The server is built using the Express<Ex></Ex> framework and Node.js{" "}
        <No></No>. It processes requests in the standard way, connects the
        appropriate middleware, forwards requests to the corresponding routes,
        and then to reducers. The server interacts with a MongoDB <Md></Md>{" "}
        database. When creating products, images are stored on the Cloudinary
        <img
          src="https://res-s.cloudinary.com/prod/image/upload/d_console:cld_new_default_cloud_logo_regular_padding.svg/w_32,h_32,c_fill,dpr_2.0/console/customer-logos/2da273ec717652775cfe9f6f9020fbb9"
          alt="logo"
          data-test="logo"
          data-testid="cloudlogo"
          class="CustomerLogostyled__StyledImage-gUaRBo eYieSt CloudLogo__StyledCustomerLogo-sc-1gt1cou llKjz"
        ></img>
        service, and only the image URL is saved in the database. Multer is a
        middleware for Node.js used to process multipart/form-data, which is
        used for file uploads. Its use in this setup is redundant, but the site
        has the capability to send not only text information but also files.
        Nodemailer is a module for Node.js applications that allows you to send
        emails easily.
        <br></br>
        Both the server-side and client-side can be expanded to meet the
        customer's specific requirements.
      </Typography>
    </div>
  );
};

export default Home;
