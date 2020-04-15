
require('dotenv').config();

const express = require("express");
const router = express.Router();
const Part = require("../../models/Part");
const Stl = require("../../models/Stl");

const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService();


// make different Blob name when upload files with same name.
const getBlobName = originalName => {
  const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
  return `${identifier}-${originalName}`;
};


router.post("/save", async (req, res) => {
  const { partName, userId, meshes } = req.body;
  console.log(meshes);
  let partId;
  const newPart = new Part({
    name: partName,
    userId,
    meshes: []
  });
  await newPart.save()
    .then(user => {
      console.log(user);
      partId = user._id;
      res.json(user);
    })
    .catch(err => console.log(err));

  meshes.map((mesh, index) => {
    const blobName = getBlobName(mesh.name);
    blobService.createBlockBlobFromLocalFile('partlibrary', blobName, mesh.filePath, (error, result) => {
      if (error) {
        // file uploaded
        console.log(error);
      } else {
        const path = `https://bfmblob.blob.core.windows.net/partlibrary/${result.name}`;
        const newStl = new Stl({
          name: mesh.name,
          azureURL: path,
          position: mesh.position,
          partType: mesh.partType,
          nickName: mesh.nickName,
          tag1: mesh.tag1,
          tag2: mesh.tag2,
          partId
        });
        newStl.save()
          .then(stl => {
            console.log(stl);
            const { _id } = stl;
            Part.findByIdAndUpdate(
              { _id: partId },
              { $push: { meshes: _id } },
              (err, result) => {
                if (err) {
                  console.log(err)
                } else {
                  console.log(result);
                }
              }
            );
          })
          .catch(err => console.log(err));
      }
    });
  });

  /* const newPart = new Part({
    name: partName,
    userId
  });
  newPart.save()
    .then(user => {
      console.log(user);
      res.json(user);
    }
    )
    .catch(err => console.log(err)); */
});

router.get("/parts", (req, res) => {

  Part.find({}, (err, result) => {
    console.log(result);
    res.json(result);
  });
});

router.get("/stl/:partId", (req, res) => {
  const { partId } = req.params;

  Stl.find({ partId }, (err, result) => {
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
