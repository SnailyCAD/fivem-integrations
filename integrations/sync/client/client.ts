RegisterNuiCallbackType("connected"); // register the type

on("__cfx_nui:connected", (data: any, cb: Function) => {
  console.log("NUI connected", data);

  cb({ ok: true });
});

RegisterNuiCallbackType("Signal100");

on("__cfx_nui:Signal100", (data: any, cb: Function) => {
  console.log("Signal100", data);

  cb({ ok: true });
});
