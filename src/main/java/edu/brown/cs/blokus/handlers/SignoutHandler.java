package edu.brown.cs.blokus.handlers;

import edu.brown.cs.blokus.db.Database;

import spark.ModelAndView;
import spark.QueryParamsMap;
import spark.Request;
import spark.Response;
import spark.TemplateViewRoute;


/**
  * Handles user logins.
  */
public class SignoutHandler implements TemplateViewRoute {
  @Override
  public ModelAndView handle(Request req, Response res) {
    res.removeCookie("session");
    res.redirect("/");
    return null;
  }
}
