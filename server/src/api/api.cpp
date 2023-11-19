#include "api.h"
#include "src/api/util.h"
#include <crow.h>
#include <crow/common.h>

namespace api {
Api::Api()
    : app {}
    , m_db {}
{
    define_get_craftsmen_endpoint();
    define_patch_craftsman_endpoint();
    app.port(8080).multithreaded().run();
}

void Api::define_get_craftsmen_endpoint()
{
    CROW_ROUTE(app, "/craftsmen").methods(crow::HTTPMethod::GET)([this](const crow::request& req) {
        crow::response res {};
        res.set_header("Access-Control-Allow-Origin", "*");

        char* postalcode = req.url_params.get("postalcode");
        if (postalcode == nullptr) {
            res.code = crow::BAD_REQUEST;
            return res;
        }

        char* page_cstr = req.url_params.get("page");
        std::size_t page { 0 };
        if (page_cstr != nullptr) {
            std::string s { page_cstr };
            std::string::size_type pos;
            try {
                page = std::stoi(page_cstr, &pos);
            } catch (std::runtime_error const&) {
                res.code = crow::BAD_REQUEST;
                return res;
            }
            if (pos != s.size()) {
                res.code = crow::BAD_REQUEST;
                return res;
            }
        }

        constexpr std::size_t per_page { 20 };
        auto ranking = util::get_ranking(m_db, postalcode);
        // TODO filtering

        std::vector<crow::json::wvalue> res_list {};
        std::size_t i { 0 };
        auto it = ranking.begin();
        // skip first pages (by far not the best way)
        for (; it != ranking.end() && i < page * per_page; it++, ++i)
            ;

        for (; it != ranking.end() && i < (page + 1) * per_page; it++, ++i) {
            res_list.push_back(m_db.service_provider_ret_val(it->first, it->second, postalcode));
        }

        res.code = crow::OK;
        res.write(crow::json::wvalue { std::move(res_list) }.dump());
        return res;
    });
}

void Api::define_patch_craftsman_endpoint()
{
    CROW_ROUTE(app, "/craftsman/<int>")
        .methods(crow::HTTPMethod::PATCH)([this](const crow::request& req, int id) {
            crow::response res {};
            res.set_header("Access-Control-Allow-Origin", "*");

            std::string id_str = std::to_string(id);

            crow::json::rvalue body {};
            try {
                body = crow::json::load(req.body);
            } catch (std::runtime_error const&) {
                res.code = crow::BAD_REQUEST;
                return res;
            }

            // check if at least one of the requered attributes is defined
            if (!(body.has("maxDrivingDistance") || body.has("profilePictureScore") ||
                  body.has("profileDescriptionScore"))) {
                res.code = crow::BAD_REQUEST;
                return res;
            }

            double maxDrivingDistance;
            if (body.has("maxDrivingDistance")) {
                try {
                    maxDrivingDistance = body["maxDrivingDistance"].d();
                } catch (std::runtime_error const&) {
                    res.code = crow::BAD_REQUEST;
                    return res;
                }

                update_maxDrivingDistance(id_str, maxDrivingDistance);
            } else {
                if (auto opt = m_db.get_max_distance(id_str); opt.has_value()) {
                    maxDrivingDistance = opt.value();
                } else {
                    res.code = crow::BAD_REQUEST;
                    return res;
                }
            }

            double profilePictureScore;
            double profileDescriptionScore;
            if (body.has("profilePictureScore") || body.has("profileDescriptionScore")) {
                if (body.has("profilePictureScore")) {
                    try {
                        profilePictureScore = body["profilePictureScore"].d();
                    } catch (std::runtime_error const&) {
                        res.code = crow::BAD_REQUEST;
                        return res;
                    }
                } else {
                    if (auto opt = m_db.get_pfp_score(id_str); opt.has_value()) {
                        profilePictureScore = opt.value();
                    } else {
                        res.code = crow::BAD_REQUEST;
                        return res;
                    }
                }

                if (body.has("profileDescriptionScore")) {
                    try {
                        profileDescriptionScore = body["profileDescriptionScore"].d();
                    } catch (std::runtime_error const&) {
                        res.code = crow::BAD_REQUEST;
                        return res;
                    }
                } else {
                    if (auto opt = m_db.get_pfd_score(id_str); opt.has_value()) {
                        profileDescriptionScore = opt.value();
                    } else {
                        res.code = crow::BAD_REQUEST;
                        return res;
                    }
                }

                update_profileScores(id_str, profilePictureScore, profileDescriptionScore);
            }

            res.write(crow::json::wvalue {
                { "id", id },
                { "updated",
                  { { "maxDrivingDistance", maxDrivingDistance },
                    { "profilePictureScore", profilePictureScore },
                    { "profileDescriptionScore", profileDescriptionScore } } } }
                          .dump());

            return res;
        });
}

void Api::update_maxDrivingDistance(std::string w_id, double maxDrivingDistance)
{
    if (maxDrivingDistance > m_db.maxMaxDist) {
        m_db.maxMaxDist = maxDrivingDistance;
    }
    m_db.set_max_distance(w_id, maxDrivingDistance);
}

void Api::update_profileScores(
    std::string w_id, double profilePictureScore, double profileDescriptionScore)
{
    m_db.set_pfp_score(w_id, profilePictureScore);
    m_db.set_pfd_score(w_id, profileDescriptionScore);
}
}
