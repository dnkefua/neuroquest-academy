import math
import os
from builtins import enumerate, len, print, range

import bpy

ROOT = r"c:\Users\A2Z\OneDrive\Documents\NDN Analytics\NeuroQuest"
MODEL_DIR = os.path.join(ROOT, "public", "models", "neuroquest")
os.makedirs(MODEL_DIR, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def mat(name, color, metallic=0.0, roughness=0.55, emission=None, strength=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Metallic"].default_value = metallic
        bsdf.inputs["Roughness"].default_value = roughness
        if emission and "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = emission
            bsdf.inputs["Emission Strength"].default_value = strength
    return material


MATS = {}


def make_materials():
    MATS.update(
        {
            "floor": mat("NQ soft graphite floor", (0.08, 0.12, 0.16, 1)),
            "wall": mat("NQ warm ivory wall", (0.72, 0.77, 0.72, 1)),
            "teal": mat("NQ luminous teal", (0.02, 0.72, 0.68, 1), emission=(0.0, 0.55, 0.5, 1), strength=0.25),
            "gold": mat("NQ reward gold", (1.0, 0.68, 0.18, 1), emission=(1.0, 0.42, 0.05, 1), strength=0.18),
            "blue": mat("NQ lab blue", (0.12, 0.5, 0.95, 1), emission=(0.05, 0.25, 0.8, 1), strength=0.18),
            "green": mat("NQ maze green", (0.08, 0.38, 0.24, 1)),
            "glass": mat("NQ lab glass", (0.55, 0.9, 1.0, 0.42), roughness=0.12, emission=(0.2, 0.7, 1, 1), strength=0.08),
            "wood": mat("NQ desk walnut", (0.48, 0.29, 0.12, 1)),
            "dark": mat("NQ dark trim", (0.02, 0.04, 0.07, 1)),
            "white": mat("NQ clean white", (0.9, 0.94, 0.92, 1)),
            "red": mat("NQ danger coral", (0.92, 0.18, 0.22, 1), emission=(0.8, 0.05, 0.05, 1), strength=0.12),
        }
    )


def cube(name, loc, scale, material):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    return obj


def cyl(name, loc, radius, depth, material, vertices=32, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return obj


def sphere(name, loc, radius, material, segments=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=16, radius=radius, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return obj


def text_obj(name, text, loc, size, material, align="CENTER"):
    bpy.ops.object.text_add(location=loc, rotation=(math.radians(75), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = text
    obj.data.align_x = align
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = 0.01
    obj.data.materials.append(material)
    return obj


def add_lights():
    bpy.ops.object.light_add(type="AREA", location=(0, -5, 7))
    key = bpy.context.object
    key.name = "NQ softbox key light"
    key.data.energy = 500
    key.data.size = 6
    bpy.ops.object.light_add(type="POINT", location=(-3, 2, 4))
    rim = bpy.context.object
    rim.name = "NQ teal rim light"
    rim.data.color = (0.0, 0.9, 0.82)
    rim.data.energy = 130


def add_camera(name, loc, rotation, focal=28):
    bpy.ops.object.camera_add(location=loc, rotation=rotation)
    camera = bpy.context.object
    camera.name = name
    camera.data.lens = focal
    bpy.context.scene.camera = camera
    return camera


def animate_float(obj, z_delta=0.35, frames=(1, 90)):
    start = obj.location.copy()
    obj.keyframe_insert("location", frame=frames[0])
    obj.location.z = start.z + z_delta
    obj.keyframe_insert("location", frame=(frames[0] + frames[1]) // 2)
    obj.location.z = start.z
    obj.keyframe_insert("location", frame=frames[1])
    if obj.animation_data and obj.animation_data.action:
        obj.animation_data.action.name = f"{obj.name} float loop"


def export_scene(filename):
    filepath = os.path.join(MODEL_DIR, filename)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format="GLB",
        export_animations=True,
        export_apply=True,
        export_yup=True,
    )
    return filepath


def classroom():
    clear_scene()
    make_materials()
    add_lights()
    cube("Classroom floor platform", (0, 0, -0.06), (8.4, 6.2, 0.12), MATS["floor"])
    cube("Classroom back wall", (0, 3.05, 1.8), (8.4, 0.12, 3.8), MATS["wall"])
    cube("Interactive number line board", (0, 2.93, 1.95), (5.8, 0.12, 2.1), MATS["dark"])
    cube("Glowing board panel", (0, 2.86, 1.95), (5.25, 0.08, 1.6), MATS["teal"])
    text_obj("Board equation label", "-5  +  10  =  5", (-0.1, 2.72, 2.08), 0.32, MATS["white"])
    for idx in range(11):
        x = -2.5 + idx * 0.5
        cube(f"Number line tick {idx - 5}", (x, 2.67, 1.55), (0.035, 0.08, 0.28 if idx % 5 == 0 else 0.18), MATS["white"])
    token = sphere("Animated answer token", (-1.2, 2.55, 1.76), 0.16, MATS["gold"])
    animate_float(token, 0.18)
    for row_y in (-1.4, -0.2, 1.0):
        for x in (-2.4, 0, 2.4):
            cube("Student collaboration desk", (x, row_y, 0.42), (1.35, 0.72, 0.18), MATS["wood"])
            cube("Desk left leg", (x - 0.55, row_y - 0.25, 0.12), (0.08, 0.08, 0.48), MATS["dark"])
            cube("Desk right leg", (x + 0.55, row_y - 0.25, 0.12), (0.08, 0.08, 0.48), MATS["dark"])
    for x in (-3.35, 3.35):
        cube("Tall learning display", (x, 1.45, 1.25), (0.8, 0.14, 1.7), MATS["blue"])
    add_camera("Classroom review camera", (0, -6.6, 3.1), (math.radians(63), 0, 0), 25)
    return export_scene("grade8-math-classroom.glb")


def lab():
    clear_scene()
    make_materials()
    add_lights()
    cube("Science lab floor platform", (0, 0, -0.06), (8.4, 6.2, 0.12), MATS["floor"])
    cube("Science lab back wall", (0, 3.05, 1.8), (8.4, 0.12, 3.8), MATS["wall"])
    cube("Central experiment bench", (0, -0.15, 0.55), (5.5, 1.55, 0.2), MATS["dark"])
    cube("Bench luminous worktop", (0, -0.15, 0.7), (5.15, 1.25, 0.08), MATS["blue"])
    for x in (-1.8, 0, 1.8):
        cyl("Glass beaker", (x, -0.2, 1.15), 0.23, 0.72, MATS["glass"], 32)
        liquid = cyl("Experiment liquid", (x, -0.2, 0.95), 0.2, 0.28, MATS["teal"], 32)
        animate_float(liquid, 0.08)
    nucleus = sphere("Animated atom nucleus", (0, 1.85, 1.65), 0.2, MATS["red"])
    animate_float(nucleus, 0.2)
    for angle in (0, 60, 120):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.72, minor_radius=0.012, location=(0, 1.85, 1.65), rotation=(math.radians(90), math.radians(angle), 0))
        orbit = bpy.context.object
        orbit.name = "Animated electron orbit"
        orbit.data.materials.append(MATS["gold"])
    for x in (-3.15, 3.15):
        cube("Wall lab cabinet", (x, 2.84, 1.95), (1.25, 0.18, 1.3), MATS["white"])
    add_camera("Lab review camera", (0, -6.4, 3.0), (math.radians(63), 0, 0), 25)
    return export_scene("grade8-science-lab.glb")


def maze():
    clear_scene()
    make_materials()
    add_lights()
    cube("Maze garden ground", (0, 0, -0.05), (9, 9, 0.1), MATS["floor"])
    walls = [
        (-3, 0, 0.7, 0.35, 6.4, 1.4),
        (3, 0, 0.7, 0.35, 6.4, 1.4),
        (0, -3, 0.7, 6.4, 0.35, 1.4),
        (0, 3, 0.7, 6.4, 0.35, 1.4),
        (-1.2, -1.7, 0.7, 3.2, 0.32, 1.4),
        (1.35, 1.55, 0.7, 3.0, 0.32, 1.4),
        (-1.7, 1.1, 0.7, 0.32, 2.8, 1.4),
        (1.7, -1.1, 0.7, 0.32, 2.8, 1.4),
    ]
    for idx, (x, y, z, sx, sy, sz) in enumerate(walls):
        cube(f"Maze hedge wall {idx}", (x, y, z), (sx, sy, sz), MATS["green"])
    avatar = sphere("Learner avatar speed core", (-2.2, -2.2, 0.45), 0.28, MATS["gold"])
    monster = sphere("Pursuit shadow challenge", (2.15, 2.05, 0.52), 0.36, MATS["red"])
    power = sphere("Teleport question power-up", (0, 0, 0.5), 0.18, MATS["teal"])
    animate_float(avatar, 0.2)
    animate_float(monster, 0.16)
    animate_float(power, 0.3)
    cube("Roadside question board", (-0.6, -3.05, 1.1), (1.7, 0.16, 0.9), MATS["dark"])
    text_obj("Maze board question", "5 - 10 = ?", (-0.6, -3.18, 1.15), 0.22, MATS["white"])
    add_camera("Maze review camera", (0, -7.2, 5.3), (math.radians(58), 0, 0), 24)
    return export_scene("learning-maze-pursuit.glb")


created = [classroom(), lab(), maze()]
print("NeuroQuest GLB assets exported:")
for path in created:
    print(path)
