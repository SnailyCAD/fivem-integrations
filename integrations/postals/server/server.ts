exports("readPostalCodes", () => {
  const fileName = "postals.json";
  const fileData = LoadResourceFile(GetCurrentResourceName(), fileName);

  try {
    return JSON.parse(fileData);
  } catch {
    return null;
  }
});
