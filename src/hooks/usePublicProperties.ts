import { useEffect, useState } from "react";
import type { Property } from "@/data/properties";

type State={properties:Property[];loading:boolean;error:string};

export function usePublicProperties():State{
  const [state,setState]=useState<State>({properties:[],loading:true,error:""});
  useEffect(()=>{let active=true;fetch("/api/properties")
    .then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not load properties.");return d;})
    .then(d=>{if(active)setState({properties:Array.isArray(d.listings)?d.listings:[],loading:false,error:""});})
    .catch(e=>{if(active)setState({properties:[],loading:false,error:e instanceof Error?e.message:"Could not load properties."});});
    return()=>{active=false};
  },[]);
  return state;
}

export function usePublicProperty(slug?:string){
  const [state,setState]=useState<{property?:Property;loading:boolean;error:string}>({loading:true,error:""});
  useEffect(()=>{if(!slug){setState({loading:false,error:"Property not found."});return;}let active=true;
    setState({loading:true,error:""});
    const key=/^PROP-/i.test(slug)?"id":"slug";
    fetch(`/api/properties?${key}=${encodeURIComponent(slug)}`)
      .then(async r=>{if(r.status===404)return {};const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not load property details.");return d;})
      .then(d=>{if(active)setState({property:d.listing,loading:false,error:""});})
      .catch(e=>{if(active)setState({loading:false,error:e instanceof Error?e.message:"Property not found."});});
    return()=>{active=false};
  },[slug]);
  return state;
}
