import escalatorProductImage from "@/app/(public)/Assets/escalator & movin walk-product.png";
import freightProductImage from "@/app/(public)/Assets/Freit elevator -product.png";
import homeLiftProductImage from "@/app/(public)/Assets/home lift-product.png";
import hospitalLiftProductImage from "@/app/(public)/Assets/hospital lift-product.png";
import hydraulicLiftProductImage from "@/app/(public)/Assets/haudraulic lift-product.png";
import observationLiftProductImage from "@/app/(public)/Assets/Observation lift-product.png";
import passengerLiftProductImage from "@/app/(public)/Assets/passenger lift-product.png";
import dumbwaiterProductImage from "@/app/(public)/Assets/dumbwaiter-product.png";

export function getElevatorProductAsset(title: string, category: string) {
  const productType = `${category} ${title}`.toLowerCase();
  if (/escalator|moving walk/.test(productType)) return escalatorProductImage;
  if (/hospital|medical/.test(productType)) return hospitalLiftProductImage;
  if (/observation|panoramic|scenic|glass/.test(productType)) return observationLiftProductImage;
  if (/hydraulic|scissor|platform/.test(productType)) return hydraulicLiftProductImage;
  if (/freight|cargo|automobile/.test(productType)) return freightProductImage;
  if (/dumbwaiter|service lift/.test(productType)) return dumbwaiterProductImage;
  if (/home|residential/.test(productType)) return homeLiftProductImage;
  if (/passenger|commercial/.test(productType)) return passengerLiftProductImage;
  return passengerLiftProductImage;
}
