using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;
using TileSystem2.Models;


namespace TileSystem2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Category : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public Category(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
        SELECT category_id, name, block 
        FROM category_master
    ";

            List<category_master> apps = new List<category_master>();
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                using (MySqlDataReader myReader = myCommand.ExecuteReader())
                {
                    while (myReader.Read())
                    {
                        apps.Add(new category_master
                        {
                            category_id = Convert.ToInt32(myReader["category_id"]),
                            name = myReader["name"].ToString(),
                            block = Convert.ToInt32(myReader["block"])
                        });
                    }
                }
            }

            return new JsonResult(apps); // ✅ No DataTable, so no System.Type serialization issue
        }

        [HttpPost]
        public JsonResult Post(category_master cat)
        {
            string query = @"
        INSERT INTO category_master (name) 
        VALUES (@name);
    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@name", cat.name);

                    myCommand.ExecuteNonQuery(); // ✅ use this for INSERT, UPDATE, DELETE
                }
            }

            return new JsonResult("Added Successfully");
        }
        [HttpPut]
        public JsonResult Put([FromBody] categoryDTO cat)
        {
            string query = @"
        UPDATE application_master SET 
        block = @block
        WHERE application_id = @application_id;
    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@category_id", cat.category_id);
                    myCommand.Parameters.AddWithValue("@block", cat.block);

                    myCommand.ExecuteNonQuery(); // ✅ Just execute, no need to read
                }
            }

            return new JsonResult("Updated Successfully");
        }
        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"
        DELETE FROM category_master 
        WHERE category_id = @category_id;
    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@category_id", id);
                    int rowsAffected = myCommand.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return new JsonResult("No matching record found.");
                    }
                }
            }

            return new JsonResult("Deleted Successfully");
        }

    }
}
