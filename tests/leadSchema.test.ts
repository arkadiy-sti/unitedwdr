import { describe,expect,it } from "vitest"; import { leadSchema } from "../src/lib/leadSchema";
const valid={firstName:"Ava",lastName:"Reed",phone:"(408) 555-0100",email:"ava@example.com",location:"95112",timing:"today",incident:"active-leak",details:"Water is entering below the upstairs bathroom.",website:"",turnstileToken:"token"};
describe("leadSchema",()=>{
  it("accepts a trimmed valid lead",()=>{expect(leadSchema.parse({...valid,firstName:" Ava "}).firstName).toBe("Ava")});
  it("rejects invalid email",()=>{expect(leadSchema.safeParse({...valid,email:"bad"}).success).toBe(false)});
  it("rejects unsupported incident values",()=>{expect(leadSchema.safeParse({...valid,incident:"fire"}).success).toBe(false)});
  it("rejects honeypot content",()=>{expect(leadSchema.safeParse({...valid,website:"spam"}).success).toBe(false)});
  it("rejects oversized details",()=>{expect(leadSchema.safeParse({...valid,details:"x".repeat(1501)}).success).toBe(false)});
});
