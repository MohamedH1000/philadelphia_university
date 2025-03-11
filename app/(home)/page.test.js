import Home from "@/app/page";
import { render, screen } from "@testing-library/react";
import { getCurrentUser, getAllCompanies } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/lib/actions/user.action");
jest.mock("@/lib/actions/company.action");

describe("Home Page", () => {
  it("redirects to /sign-in if no user is logged in", async () => {
    getCurrentUser.mockResolvedValueOnce(null);
    await Home();
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("redirects to /dashboard if user role is university", async () => {
    getCurrentUser.mockResolvedValueOnce({ role: { name: "university" } });
    await Home();
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects to /company if user role is company", async () => {
    getCurrentUser.mockResolvedValueOnce({ role: { name: "company" } });
    await Home();
    expect(redirect).toHaveBeenCalledWith("/company");
  });
});
