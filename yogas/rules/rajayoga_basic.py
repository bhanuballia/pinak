# yogas/rules/rajayoga_basic.py
def _rule(chart):
    out=[]
    # Raja yoga simple: a planet in Kendra AND in trikona or lord in trikona with kendraship
    kendra=[1,4,7,10]
    trikona=[1,5,9]
    # if any benefic (Jupiter/Venus/Mercury) occupies Kendra and owns trikona => raja yoga
    for p in ["Jupiter","Venus","Mercury"]:
        for hno,hinfo in chart.get("houses",{}).items():
            if p in hinfo.get("planets",[]) and int(hno) in kendra:
                out.append({"name":"Raja Yoga (basic)", "desc":f"{p} in Kendra {hno}"})
    return out

def register():
    return [ _rule ]
