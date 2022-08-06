import React from "react";
import { Helmet } from "react-helmet";
import "../../assets/css/styles.css";
import Feed from "./Feed";

const App = () => {
  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta
          name="description"
          content="Newsfeed of all your friends on Graphbook"
        />
      </Helmet>
      <Feed />
    </div>
  );
};

export default App;
