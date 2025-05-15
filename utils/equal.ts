export default function deepEqual(obj1: any, obj2: any): boolean {
  
  // Handle primitive types and references
  if (obj1 === obj2) return true;

  // If either is not an object or is null, return false
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }

  // Check if both are arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) return false;
    }
    return true;
  }

  // Check if both are objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If the number of keys differs, return false
  if (keys1.length !== keys2.length) return false;

  // Check all keys and their values
  for (let key of keys1) {
    // Check if key is in the second object and recurse for values
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
