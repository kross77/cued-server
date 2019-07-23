export const logger = className => {
  return new Proxy(new className(), {
    get: function(target, name, receiver) {
      if (!target.hasOwnProperty(name)) {
        if (typeof target[name] === "function") {
          console.log(
            "Calling Method : ",
            name,
            "|| on : ",
            target.constructor.name
          );
        }
        return new Proxy(target[name], this);
      }
      return Reflect.get(target, name, receiver);
    }
  });
};
