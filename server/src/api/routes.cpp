
#include "routes.h"
#include <crow.h>
#include <string>

namespace api {
void start_api()
{
    crow::SimpleApp app;

    CROW_ROUTE(app, "/craftsmen")
    ([](const crow::request& req) {
        auto postalcode = req.url_params.get("postalcode");
        return "Hello World\n";
    });

    app.port(8080).multithreaded().run();
}
}
