import { Request, Response } from "express";
import Joi from "joi";
import path from "path";
import { db } from "../db";

const planetSchema = Joi.object({
  /*  id: Joi.number().integer().required(), */
  name: Joi.string().required(),
});

const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets`);
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE ID=$1`,
    Number(id)
  );
  res.status(200).json(planet);
};

const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validatedNewPlanet = planetSchema.validate(newPlanet);

  if (validatedNewPlanet.error) {
    return res
      .status(400)
      .json({ msg: validatedNewPlanet.error.details[0].message });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
    res.status(201).json({ msg: "Il pianeta è stato creato!" });
  }
};

const updateOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);
  res.status(200).json({ msg: "The planet has been updated!" });
};

const deleteOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));
  res.status(200).json({ msg: "The planet has been deleted!" });
};

const createImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fileName = req.file?.path;

  if (fileName) {
    db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);
    res.status(201).json({ msg: "Planet image uploaded successfully." });
  } else {
    res.status(400).json({ msh: "Planet image failed uploads" });
  }
};

export {
  getAll,
  getOneById,
  create,
  updateOneById,
  deleteOneById,
  createImage,
};
