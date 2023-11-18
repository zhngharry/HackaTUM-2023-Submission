#pragma once

#include "src/database/db.h"
#include <crow/app.h>
namespace api {
class Api {
public:
    Api();

private:
    crow::SimpleApp app;
    database::Database m_db;
};
}
