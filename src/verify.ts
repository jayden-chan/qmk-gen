import { Config } from "./types";
export function verifyConfig(conf: Config): string[] {
  const errors: string[] = [];
  Object.entries(conf.layers).forEach(([key, layer], idx) => {
    if (layer.typing.length !== conf.lens.length) {
      errors.push(
        `Layer ${idx + 1} doesn't have the correct number of rows (${
          layer.typing.length
        } actual, ${conf.lens.length} expected)`
      );
    }

    if (layer.fn.length !== conf.lens.length) {
      errors.push(
        `Layer ${idx + 1} doesn't have the correct number of rows (${
          layer.fn.length
        } actual, ${conf.lens.length} expected)`
      );
    }

    for (let i = 0; i < Math.min(layer.typing.length, conf.lens.length); i++) {
      if (layer.typing[i].length !== conf.lens[i]) {
        errors.push(
          `Row ${
            i + 1
          } of layer "${key}/typing" doesn't have the right number of keys (${
            layer.typing[i].length
          } actual, ${conf.lens[i]} expected)`
        );
      }
    }

    for (let i = 0; i < Math.min(layer.fn.length, conf.lens.length); i++) {
      if (layer.fn[i].length !== conf.lens[i]) {
        errors.push(
          `Row ${
            i + 1
          } of layer "${key}/fn" doesn't have the right number of keys (${
            layer.fn[i].length
          } actual, ${conf.lens[i]} expected)`
        );
      }
    }
  });

  return errors;
}
