
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;
using TileSystem2.Models;

namespace TileSystem2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Application_master : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public Application_master(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
        SELECT application_id, name, block 
        FROM application_master
    ";

            List<application_master> apps = new List<application_master>();
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                using (MySqlDataReader myReader = myCommand.ExecuteReader())
                {
                    while (myReader.Read())
                    {
                        apps.Add(new application_master
                        {
                            application_id = Convert.ToInt32(myReader["application_id"]),
                            name = myReader["name"].ToString(),
                            block = Convert.ToInt32(myReader["block"])
                        });
                    }
                }
            }

            return new JsonResult(apps); // ✅ No DataTable, so no System.Type serialization issue
        }

        [HttpPost]
        public JsonResult Post(application_master app)
        {
            string query = @"
        INSERT INTO application_master (name) 
        VALUES (@name);
    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@name", app.name);

                    myCommand.ExecuteNonQuery(); // ✅ use this for INSERT, UPDATE, DELETE
                }
            }

            return new JsonResult("Added Successfully");
        }
        [HttpPut]
        public JsonResult Put([FromBody] applicationupdateblockdto app)
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
                    myCommand.Parameters.AddWithValue("@application_id", app.application_id);
                    myCommand.Parameters.AddWithValue("@block", app.block);

                    myCommand.ExecuteNonQuery(); // ✅ Just execute, no need to read
                }
            }

            return new JsonResult("Updated Successfully");
        }
        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"
        DELETE FROM application_master 
        WHERE application_id = @application_id;
    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@application_id", id);
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
