"use client";
import { NebulaPlane }       from "./layers/NebulaPlane";
import { MultiLayerStarfield } from "./layers/MultiLayerStarfield";
import { DustField }          from "./layers/DustField";
import { ShootingStar }       from "./layers/ShootingStar";
import { RadialBacklight }    from "./layers/RadialBacklight";
import { FresnelOrbit }       from "./orbit/FresnelOrbit";
import { HeroCameraRig }      from "./camera/HeroCameraRig";

export function DarkCinematicScene() {
  return (
    <>
      <NebulaPlane />
      <MultiLayerStarfield />
      <DustField />
      <ShootingStar />
      <RadialBacklight />
      <FresnelOrbit />
      <HeroCameraRig />
    </>
  );
}
