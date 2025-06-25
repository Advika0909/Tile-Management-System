using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;
using TileSystem2.Models;

namespace TileSystem2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Product : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public Product(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
        SELECT prod_id ,category_id ,application_id ,prod_name ,sqcode ,block 
        FROM products
    ";

            List<products> apps = new List<products>();
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                using (MySqlDataReader myReader = myCommand.ExecuteReader())
                {
                    while (myReader.Read())
                    {
                        apps.Add(new products
                        {
                            prod_id = Convert.ToInt32(myReader["prod_id"]),
                            category_id = Convert.ToInt32(myReader["category_id"]),
                            application_id = Convert.ToInt32(myReader["application_id"]),
                            prod_name = myReader["prod_name"].ToString(),
                            sqcode = myReader["sqcode"].ToString(),
                            block = Convert.ToInt32(myReader["block"])
                        });
                    }
                }
            }

            return new JsonResult(apps); // ✅ No DataTable, so no System.Type serialization issue
        }

        [HttpPost]
        public JsonResult Post(products prod)
        {
            string query = @"
        INSERT INTO products (category_id, application_id, prod_name, sqcode)
VALUES (@category_id, @application_id, @prod_name, @sqcode);

    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@category_id", prod.category_id);
                    myCommand.Parameters.AddWithValue("@application_id", prod.application_id);
                    myCommand.Parameters.AddWithValue("@prod_name", prod.prod_name);
                    myCommand.Parameters.AddWithValue("@sqcode", prod.sqcode);

                    myCommand.ExecuteNonQuery(); // ✅ use this for INSERT, UPDATE, DELETE
                }
            }

            return new JsonResult("Added Successfully");
        }
        [HttpPut]
        public JsonResult Put([FromBody] productDTO prod)
        {
            string query = @"
        UPDATE products SET 
        block = @block
        WHERE prod_id = @prod_id;
    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@prod_id", prod.prod_id);
                    myCommand.Parameters.AddWithValue("@block", prod.block);

                    myCommand.ExecuteNonQuery(); // ✅ Just execute, no need to read
                }
            }

            return new JsonResult("Updated Successfully");
        }
        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"
        DELETE FROM products 
        WHERE prod_id = @prod_id;
    ";

            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");

            using (MySqlConnection mycon = new MySqlConnection(sqlDataSource))
            {
                mycon.Open();
                using (MySqlCommand myCommand = new MySqlCommand(query, mycon))
                {
                    myCommand.Parameters.AddWithValue("@prod_id", id);
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
