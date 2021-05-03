const express = require("express");
const Service = require("../database/Service");
const router = new express.Router();

//Create a new Service
router.post("/services", async (req, res) => {
  try {
    const service = new Service({
      name: req.body.name,
      description: req.body.description,
    });
    await service.save();
    res.status(201).send(service);
  } catch (e) {
    res.status(400).send(e);
  }
});

//list all services
router.get("/services", async (req, res) => {
  try {
    const service = await service.find({});
    res.send(service);
  } catch (e) {
    res.status(500).send();
  }
});

//find a service By It's Id
router.get("/service/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const service = await service.findOne({ _id });

    if (!service) {
      return res.status(404).send();
    }

    res.send(service);
  } catch (e) {
    res.status(500).send();
  }
});

//Update the Service
router.patch("/service/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "description"];
    const service = await Service.findById(req.params.id);
    updates.forEach((update) => {
      if (allowedUpdates.includes(update)) {
        service[update] = request.body[update];
      }
    });
    await service.save();
    res.status(200).send(service);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete the service
router.delete("/service/:id", async (req, res) => {
  try {
    const service = await service.findOneAndDelete({
      _id: req.params.id,
    });

    if (!service) {
      res.status(404).send();
    }
    await service.remove();
    res.status(204).send("Service Deleted");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
