import { Observable, BehaviorSubject, isObservable } from "rxjs";

// 数据类型
export type XData<T> = T | BehaviorSubject<T> | Observable<T> | any;

// 类型判断
export const XIsType = (type: string) => (object: any) => Object.prototype.toString.call(object) === `[object ${type}]`;

export const XIsString = XIsType("String");
export const XIsArray = XIsType("Array");
export const XIsNumber = XIsType("Number");
export const XIsBoolean = XIsType("Boolean");
export const XIsObject = XIsType("Object");
export const XIsNull = XIsType("Null");
export const XIsFunction = XIsType("Function");
export const XIsDate = XIsType("Date");
export const XIsRegExp = XIsType("RegExp");
export const XIsValue = (object: any) =>
  XIsString(object) || XIsNumber(object) || XIsBoolean(object) || XIsDate(object);
export const XIsUndefined = (object: any) => {
  return typeof object === "undefined";
};
export const XIsValueArray = (object: any) => {
  return XIsArray(object) && object.length > 0 && !XIsObject(object[0]);
};
export const XIsObjectArray = (object: any) => {
  return XIsArray(object) && object.length > 0 && XIsObject(object[0]);
};
export const XIsObservable = (object: any) => isObservable(object);