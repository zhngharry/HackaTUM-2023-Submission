#include <crow.h>
#include <string>
#include "routes.h"

void start_api() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/craftsmen")
    ([](const crow::request& req){
        auto postalcode = req.url_params.get("postalcode");
        return "Hello World\n";
        /* if (postalcode)
            return std::format("The Postalcode was: {}", postalcode);
        else
            return std::format("Bad Request: Postal code is missing."); */
    });

    app.port(8080).multithreaded().run();

}