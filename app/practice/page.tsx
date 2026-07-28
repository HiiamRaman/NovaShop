"use client";

import { useForm } from "react-hook-form";

function Practicepage() {
  const { register, handleSubmit } = useForm();

  function onsubmit(data: any) {
    console.log("Data are ", data);
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
        <input {...register ('fullname')} placeholder="Enter your name"/>
        <input {...register("email")} placeholder="enter Email" />
        <input {...register("password")}  placeholder="Enter password"/>

        <input {...register('address')}  />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Practicepage;
