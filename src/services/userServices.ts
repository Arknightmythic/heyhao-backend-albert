import { ResetPasswordValues, SignInValues, SignUpValues } from "../utils/schema/user";
import bcrypt from "bcrypt";
import * as UserRepositories from "../repositories/userRepositories";
import jwt from "jsonwebtoken";
import mailtrap from "../utils/mailtrap";
import transport from "../utils/transport";

const FRONTENDURL = process.env.FRONTEND_URL ?? "";

export const signUp = async (data: SignUpValues, file: Express.Multer.File) => {
  const IsEmailExist = await UserRepositories.IsEmailExist(data.email);

  if (IsEmailExist >= 1) {
    throw new Error("email already taken");
  }

  const user = await UserRepositories.createUser(
    {
      ...data,
      password: bcrypt.hashSync(data.password, 12),
    },
    file.filename
  );

  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "1 days",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token,
  };
};

export const signin = async (data: SignInValues) => {
  const IsEmailExist = await UserRepositories.IsEmailExist(data.email);

  if (IsEmailExist === 0) {
    throw new Error("Email not registered");
  }

  const user = await UserRepositories.findUserByEmail(data.email);

  if (!user) {
    // Additional safety check
    throw new Error("User not found");
  }

  if (!bcrypt.compareSync(data.password, user.password)) {
    throw new Error("email or password is incorrect");
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "1 days",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token,
  };
};

export const getEmailReset = async (email: string) => {
  const data = await UserRepositories.createPasswordReset(email);

  // await mailtrap.send({
  //     from:{
  //         email:'albert_heyhao@test.com',
  //         name:'albert'
  //     },
  //     to:[{email:email}],
  //     subject:"Reset Password mailtrap",
  //     text: `berikut link reset password ${FRONTENDURL}/${data.token}`
  // })

  await transport.sendMail({
    from: "albert_heyhao@test.com",
    to: email,
    subject: "Reset Password Request",
    text: `berikut link reset password: ${FRONTENDURL}/${data.token}`,
  });

  return true;
};



export const updatePassword = async(data:ResetPasswordValues, token:string) =>{
  const tokenData = await UserRepositories.findResetDataByToken(token)

  if(!tokenData){
    throw new Error("Token Reset Invalid")
  }

  await UserRepositories.updatePassword(
    tokenData.user.email,
    bcrypt.hashSync(data.password, 12)
  )

  await UserRepositories.deleteTokenResetById(tokenData.id)

  return true
}