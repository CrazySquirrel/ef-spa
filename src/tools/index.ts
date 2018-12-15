export function prop(target: any = {}, path: string = '', def?: any) {
  try {
    const parsedPath = path.trim().split('.');

    for (const p of parsedPath) {
      target = target[p];
    }

    return target || def;
  } catch (e) {
    return def;
  }
}

export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
