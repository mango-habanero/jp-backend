import {Router} from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send({ status: "OPTIMAL" });
});

export default router;