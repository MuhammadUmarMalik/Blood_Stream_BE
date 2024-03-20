/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'



Route.get('/', async () => {
  return { hello: 'world' }
})



// check db connection
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

// Route.get('/users', async () => {
//   return (// users endpoints
//   Route.group(() => {
//     // login endpoint
//   Route.post("/signin", "UsersController.login");
//   Route.post("/signup", "UsersController.store");
//   Route.get("/logout", "UsersController.logout");
  
  
//     Route.get("/users", "UsersController.index");
//     Route.get("/users/:blood_group", "UsersController.show");
//     Route.get("/users/:id", "UsersController.show");
//     // Route.post("/users", "UsersController.store");
//     Route.put("/users/:id", "UsersController.update");
//     Route.delete("/users/:id", "UsersController.destroy");
//     // donations endpoints
   
//   }).prefix("api")
//   )
// })

Route.group(() => {
  // login endpoint
Route.post("/signin", "UsersController.login");
Route.post("/signup", "UsersController.store");
Route.get("/logout", "UsersController.logout");
 
}).prefix("auth")
//user endpoint
Route.group(() => {
  Route.get("/", "UsersController.index");
  Route.get("/:blood_group", "UsersController.show");
  Route.get("/:id", "UsersController.show");
  // Route.post("/users", "UsersController.store");
  Route.put("/:id", "UsersController.update");
  Route.delete("/:id", "UsersController.destroy");
  // donations endpoints
 
}).prefix("users")

Route.group(() => {
  // Donations endpoint

  Route.post("/:param", "DonationsController.create");
  Route.delete("/", "DonationsController.index");
  // donations endpoints
 
}).prefix("donations")