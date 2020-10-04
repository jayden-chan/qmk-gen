import { Config } from "./types";
export function verifyConfig(conf: Config): string[] | undefined {
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

    if (conf.wids.length !== conf.lens.length) {
      errors.push("Lengths/Widths mismatch");
    }

    for (let i = 0; i < Math.min(conf.wids.length, conf.lens.length); i++) {
      if (conf.wids[i].length !== conf.lens[i]) {
        errors.push(
          `Widths row ${i + 1} doesn't match lens row (expected ${
            conf.lens[i]
          }, actual ${conf.wids[i].length})`
        );
      }
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

  return errors.length > 0 ? errors : undefined;
}

export function printErrors(errors: string[]) {
  console.error("ERROR: Failed to verify config");
  console.error(
    `\nFound ${errors.length} error${errors.length === 1 ? "" : "s"}:`
  );
  errors.forEach((error, idx) => {
    console.error(`\t${idx + 1}: ${error}`);
  });
}
