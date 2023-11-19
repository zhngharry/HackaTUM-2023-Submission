
#include "src/database/db.h"
#include <optional>
#include <string>
#include <unordered_map>
#include <vector>

int main(void)
{
    database::Database d{};

    std::unordered_map<std::string, std::vector<std::string>> um {};

    for (size_t i=1; i< 26277; i++){
        std::cout << i << std::endl;
        std::string plz;
        std::string wi = std::to_string(i);
        if(auto opt = d.get_nearest_plz(wi)){
            plz = opt.value(); 
        }
        if(!um.contains(plz)){
            std::vector<std::string> v{};
            um.insert_or_assign(plz, v);
        }
        um.find(plz)->second.push_back(wi);
    }

    for (auto& p: um){
       d.add_nerest_wi(p.first, p.second);
    }

}
