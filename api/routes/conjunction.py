from fastapi import APIRouter, HTTPException
from core.database import client

router = APIRouter()

@router.get("/pair/{planet1}/{planet2}")
async def get_conjunction(planet1: str, planet2: str):
    try:
        db = client["Two_Planet_Conjunction"]
        p1, p2 = planet1.capitalize(), planet2.capitalize()
        doc = await db.Conjunctions.find_one({
            "$or": [
                {"planet1": p1, "planet2": p2},
                {"planet1": p2, "planet2": p1}
            ]
        })
        if not doc:
            raise HTTPException(status_code=404, detail=f"No conjunction data for {p1}-{p2}")
        doc["_id"] = str(doc["_id"])
        return doc
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all")
async def get_all_conjunctions():
    try:
        db = client["Two_Planet_Conjunction"]
        cursor = db.Conjunctions.find({})
        docs = await cursor.to_list(length=200)
        for d in docs:
            d["_id"] = str(d["_id"])
        return docs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/planet/{planet}")
async def get_conjunctions_by_planet(planet: str):
    try:
        db = client["Two_Planet_Conjunction"]
        p = planet.capitalize()
        cursor = db.Conjunctions.find({"$or": [{"planet1": p}, {"planet2": p}]})
        docs = await cursor.to_list(length=50)
        for d in docs:
            d["_id"] = str(d["_id"])
        if not docs:
            raise HTTPException(status_code=404, detail=f"No conjunction data for {p}")
        return {"planet": p, "conjunctions": docs}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Detailed planet-pair collection routes ──────────────────────────────────

def _collection_name(p1: str, p2: str) -> str:
    """Build collection name: Sun + Mars -> Sun_Mars"""
    return f"{p1.capitalize()}_{p2.capitalize()}"


@router.get("/detail/{planet1}/{planet2}")
async def get_conjunction_detail(planet1: str, planet2: str):
    """
    Returns the detailed document from a planet-pair specific collection
    (e.g. Sun_Mars, Moon_Jupiter). Tries both orderings automatically.
    """
    try:
        db = client["Two_Planet_Conjunction"]
        for col_name in (_collection_name(planet1, planet2),
                         _collection_name(planet2, planet1)):
            col = db[col_name]
            doc = await col.find_one({})
            if doc:
                doc["_id"] = str(doc["_id"])
                doc["_collection"] = col_name
                return doc

        raise HTTPException(
            status_code=404,
            detail=f"No detailed collection found for {planet1.capitalize()}-{planet2.capitalize()}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/detail/all")
async def list_detail_collections():
    """
    Lists all planet-pair specific collections in Two_Planet_Conjunction
    (i.e. every collection except 'Conjunctions').
    """
    try:
        db = client["Two_Planet_Conjunction"]
        all_collections = await db.list_collection_names()
        detail_cols = [c for c in all_collections if c != "Conjunctions"]
        return {"detail_collections": sorted(detail_cols), "count": len(detail_cols)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Triple Planet Conjunction Routes ──────────────────────────────────────────

def _triple_collection_name(p1: str, p2: str, p3: str) -> str:
    """Build alphabetized triple collection name: Moon + Sun + Mars -> Mars_Moon_Sun"""
    planets = sorted([p1.capitalize(), p2.capitalize(), p3.capitalize()])
    return f"{planets[0]}_{planets[1]}_{planets[2]}"


@router.get("/triple/detail/{planet1}/{planet2}/{planet3}")
async def get_triple_conjunction_detail(planet1: str, planet2: str, planet3: str):
    """
    Returns the detailed document from a triple-planet specific collection
    (e.g. Mars_Moon_Sun) in Triple_Planet_Conjunction database.
    """
    try:
        db = client["Triple_Planet_Conjunction"]
        col_name = _triple_collection_name(planet1, planet2, planet3)
        col = db[col_name]
        doc = await col.find_one({})
        if doc:
            doc["_id"] = str(doc["_id"])
            doc["_collection"] = col_name
            return doc

        # Fallback: Try to gather data from constituent pairs
        pairs_db = client["Two_Planet_Conjunction"]
        planets = [planet1.capitalize(), planet2.capitalize(), planet3.capitalize()]
        effects = {}
        
        # Try all 3 possible pairs
        for i in range(3):
            for j in range(i + 1, 3):
                p1, p2 = planets[i], planets[j]
                c_name = _collection_name(p1, p2)
                # Try both orderings for the pair collection
                for alt_name in (c_name, _collection_name(p2, p1)):
                    pair_doc = await pairs_db[alt_name].find_one({})
                    if pair_doc:
                        # Extract description or interpretation
                        val = pair_doc.get("description") or pair_doc.get("interpretation") or pair_doc.get("results")
                        if val:
                            effects[f"{p1} & {p2}"] = val
                        break
        
        if effects:
            combined_text = f"Detailed triple conjunction data for {planet1}-{planet2}-{planet3} is currently being compiled. Below are the insights for the constituent planetary pairs:\n\n"
            for pair_name, interpretation in effects.items():
                combined_text += f"### {pair_name}\n{interpretation}\n\n"
            
            return {
                "planets": planets,
                "description": combined_text.strip(),
                "_fallback": True,
                "_pair_count": len(effects)
            }

        raise HTTPException(
            status_code=404,
            detail=f"No detailed triple collection or constituent pairs found for {planet1.capitalize()}-{planet2.capitalize()}-{planet3.capitalize()}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/triple/all")
async def list_triple_collections():
    """Lists all collections in the Triple_Planet_Conjunction database."""
    try:
        db = client["Triple_Planet_Conjunction"]
        all_collections = await db.list_collection_names()
        return {"triple_collections": sorted(all_collections), "count": len(all_collections)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Four Planet Conjunction Routes ──────────────────────────────────────────

def _four_collection_name(p1: str, p2: str, p3: str, p4: str) -> str:
    """Build alphabetized four-planet collection name: Moon + Sun + Mars + Jupiter -> Jupiter_Mars_Moon_Sun"""
    planets = sorted([p1.capitalize(), p2.capitalize(), p3.capitalize(), p4.capitalize()])
    return f"{planets[0]}_{planets[1]}_{planets[2]}_{planets[3]}"


@router.get("/four/detail/{planet1}/{planet2}/{planet3}/{planet4}")
async def get_four_conjunction_detail(planet1: str, planet2: str, planet3: str, planet4: str):
    """
    Returns the detailed document from a four-planet specific collection
    in Four_Planet_Conjunction database.
    """
    try:
        db = client["Four_Planet_Conjunction"]
        col_name = _four_collection_name(planet1, planet2, planet3, planet4)
        col = db[col_name]
        doc = await col.find_one({})
        if doc:
            doc["_id"] = str(doc["_id"])
            doc["_collection"] = col_name
            return doc

        # Fallback: Try to gather data from constituent pairs
        pairs_db = client["Two_Planet_Conjunction"]
        planets = [planet1.capitalize(), planet2.capitalize(), planet3.capitalize(), planet4.capitalize()]
        effects = {}
        
        # Try all possible pairs (6 combinations)
        for i in range(4):
            for j in range(i + 1, 4):
                p1, p2 = planets[i], planets[j]
                c_name = _collection_name(p1, p2)
                for alt_name in (c_name, _collection_name(p2, p1)):
                    pair_doc = await pairs_db[alt_name].find_one({})
                    if pair_doc:
                        val = pair_doc.get("description") or pair_doc.get("interpretation") or pair_doc.get("results")
                        if val:
                            effects[f"{p1} & {p2}"] = val
                        break

        if effects:
            combined_text = f"Detailed four-planet conjunction data for {planet1}-{planet2}-{planet3}-{planet4} is currently being compiled. Below are the insights for the constituent planetary pairs:\n\n"
            for pair_name, interpretation in effects.items():
                combined_text += f"### {pair_name}\n{interpretation}\n\n"

            return {
                "planets": planets,
                "description": combined_text.strip(),
                "_fallback": True,
                "_pair_count": len(effects)
            }

        raise HTTPException(
            status_code=404,
            detail=f"No detailed four-planet collection or constituent pairs found for {planet1.capitalize()}-{planet2.capitalize()}-{planet3.capitalize()}-{planet4.capitalize()}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/four/all")
async def list_four_collections():
    """Lists all collections in the Four_Planet_Conjunction database."""
    try:
        db = client["Four_Planet_Conjunction"]
        all_collections = await db.list_collection_names()
        return {"four_collections": sorted(all_collections), "count": len(all_collections)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
