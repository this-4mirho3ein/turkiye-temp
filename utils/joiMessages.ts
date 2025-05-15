import { Language } from "@/types/enums";
import faTranslation from "@/locales/fa/translation";
const joiMessages = (label: string, lang: Language = Language.Fa) => {
  const fa = faTranslation[0];
  return {
    "string.email": `${fa.string[label]} ${fa.joi.string.email}`,
    "string.base": `${fa.string[label]} ${fa.joi.string.base}`,
    "string.min": `${fa.string[label]} ${fa.joi.string.min}`,
    "string.max": `${fa.string[label]} ${fa.joi.string.max}`,
    "string.length": `${fa.string[label]} ${fa.joi.string.length}`,
    "string.alphanum": `${fa.string[label]} ${fa.joi.string.alphanum}`,
    "string.pattern": `${fa.string[label]} ${fa.joi.string.pattern}`,
    "any.required": `${fa.string[label]} ${fa.joi.any.required}`,
    "any.only": `${fa.string[label]} ${fa.joi.any.only}`,
    "string.empty": `${fa.string[label]} ${fa.joi.string.empty}`,
    "string.pattern.base": `${fa.string[label]} ${fa.joi.string.pattern.base}`,
    "number.base": `${fa.string[label]} ${fa.joi.number.base}`,
    "number.min": `${fa.string[label]} ${fa.joi.number.min}`,
    "number.max": `${fa.string[label]} ${fa.joi.number.max}`,
    "array.base": `${fa.string[label]} ${fa.joi.array.base}`,
    "array.min": `${fa.string[label]} ${fa.joi.array.min}`,
    "array.max": `${fa.string[label]} ${fa.joi.array.max}`,
    "boolean.base": `${fa.string[label]} ${fa.joi.boolean.base}`,
    "date.base": `${fa.string[label]} ${fa.joi.date.base}`,
    "date.format": `${fa.string[label]} ${fa.joi.date.format}`,
    "date.min": `${fa.string[label]} ${fa.joi.date.min}`,
    "date.max": `${fa.string[label]} ${fa.joi.date.max}`,
    "date.greater": `${fa.string[label]} ${fa.joi.date.greater}`,
    "object.base": `${fa.string[label]} ${fa.joi.object.base}`,
    "object.unknown": `${fa.string[label]} ${fa.joi.object.unknown}`,
    "object.missing": `${fa.string[label]} ${fa.joi.object.missing}`,
  };
};
export default joiMessages;
