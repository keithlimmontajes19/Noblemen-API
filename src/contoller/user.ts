import { getRepository } from "typeorm";
import { User } from "../entity/User";

export const UserConttoller = async (req, res) => {
  // const userRepo = getRepository(User);

  // const user = userRepo.create({
  //   firstName: "keith",
  //   lastName: " Montajes",
  //   age: 28,
  // });

  // await userRepo.save(user).catch((err) => console.log(err));

  res.json("hello");
};
