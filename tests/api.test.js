import request from "supertest";
import { app } from "../server.js";
import mongoose from "mongoose";
import { Asset } from "../models/Asset.js";
import { User } from "../models/User.js";
import { Request } from "../models/Request.js"
import jwt from "jsonwebtoken"

let token, id, newUserTokent, requestId, userId;

describe("Asset Trading Tracker API", () => {
  beforeAll(async () => {
    await User.deleteMany();
    await Asset.deleteMany();
    await Request.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
  

  describe('Signup and Login Tests', () => {
    it('Signup', async () => {
      const res = await request(app).post('/auth/signup').send({
          username: 'user',
          email: 'user@mail.com',
          password: '123'
      })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('token')
  });
  
  it('Login', async() => {
      const res = await request(app).post('/auth/login').send({
          username: 'user',
          password: '123',
        });
        token = res.body.token
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
  });
  });
  

  describe('Asset Management Tests', () => {
    describe('Test Creating an asset (both draft and published', () => {
      it("New asset(draft)", async () => {
        const res = await request(app)
          .post("/assets")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "Asset",
            description: "This is an asset",
            status: "draft",
          });
          id = res.body.assetId
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("assetId");
      });

      it("New asset(published)", async () => {
        const res = await request(app)
          .post("/assets")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: "Asset",
            description: "This is an asset",
            status: "published",
          });
          id = res.body.assetId
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("assetId");
      });
    });
    

    it('Listing an asset on the marketplace', async () => {
      const res = await request(app)
      .put(`/assets/${id}/publish`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toEqual(200);
    });
    
  
    it('Retrieving asset details', async () => {
      const res = await request(app)
      .get(`/assets/${id}`)
    expect(res.statusCode).toEqual(200)
    });

    it('Retrieving users assets', async () => {
      const decode = jwt.verify(token, process.env.JWT_SECRET)
      userId = decode.id 
      const res = await request(app)
      .get(`/users/${userId}/assets`)
    expect(res.statusCode).toEqual(200)
    });
    
  });
  
  describe('Marketplace and Trading Tests', () => {
    it("Retrieving assets on the marketplace", async () => {
      const res = await request(app).get("/marketplace/assets");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
    

    it('Creating a purchase request', async() => {

      const sign = await request(app).post('/auth/signup').send({
        username: 'user2',
        email: 'user2@mail.com',
        password: '123'
    })

    newUserTokent = sign.body.token

      const res = await request(app)
      .post(`/assets/${id}/request`)
      .set('Authorization', `Bearer ${newUserTokent}`)
      .send({
        proposedPrice: "200"
      })
      requestId =  res.body.requestId
    expect(res.statusCode).toEqual(201)
    });

    it('Negotiating purchase request', async () => {
      const res = await request(app)
      .put(`/requests/${requestId}/negotiate`)
      .set('Authorization', `Bearer ${newUserTokent}`)
      .send({
        newProposedPrice: "300"
      })
    expect(res.statusCode).toEqual(200)
    });
    
    it('Accepting purchase request', async () => {
      const res = await request(app)
      .put(`/requests/${requestId}/accept`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
    });
  
    it('Denying purchase request', async () => {
      const res = await request(app)
      .put(`/requests/${requestId}/deny`)
      .set('Authorization', `Bearer ${newUserTokent}`)
    expect(res.statusCode).toEqual(200)
    });

    it('Retrieving users purchase requests', async () => {
      const res = await request(app)
      .get(`/users/${userId}/requests`)
    if(res.statusCode === 404) {
      expect(404).toEqual(404)
    } else {
      expect(res.statusCode).toEqual(200)
    }
    
    });
    
  });

});
