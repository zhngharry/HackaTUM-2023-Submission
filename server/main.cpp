#include "src/database/db.h"


int main(void){
    database::Database db{};
    std::string plz = "99817";
    db.get_ranking(plz);
}
