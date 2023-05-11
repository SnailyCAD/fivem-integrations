RegisterNuiCallbackType("connected"); // register the type

// register a magic event name
on("__cfx_nui:connected", (data: any, cb: Function) => {
  console.log("NUI connected", data);

  cb({ ok: true });
});
