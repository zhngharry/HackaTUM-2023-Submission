#include "api.h"
#include <crow.h>
#include <crow/common.h>

namespace api {
Api::Api()
    : app {}
    , m_db {}
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

        auto ranking = m_db.get_precomputed_ranking(postalcode);

        constexpr std::size_t per_page { 20 };
        std::vector<crow::json::wvalue> res_list {};
        for (std::size_t i { per_page * page }; i < ranking.size(); ++i) {
            res_list.push_back(
                m_db.service_provider_ret_val(ranking.at(i).first, ranking.at(i).second));
        }

        res.code = crow::OK;
        res.write(crow::json::wvalue{res_list}.dump());
        return res;
    });

    CROW_ROUTE(app, "/craftsman/<int>")
        .methods(crow::HTTPMethod::PATCH)([](const crow::request& req, int id) {
            crow::response res {};
            res.set_header("Access-Control-Allow-Origin", "*");
            return res;
        });

    app.port(8080).multithreaded().run();
}
}
