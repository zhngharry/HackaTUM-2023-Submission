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

    void define_get_craftsmen_endpoint();
    void define_patch_craftsman_endpoint();
    bool update_maxDrivingDistance(std::string w_id, double maxDrivingDistance);
    bool update_profileScores(std::string w_id, double profilePictureScore, double profileDescriptionScore);
};
}
