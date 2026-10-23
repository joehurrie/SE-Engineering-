import { redirect } from "next/navigation";

export default function AdminServicesPage() {
  redirect("/admin/content?section=home_services");
}
