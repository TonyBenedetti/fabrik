/*! Fabrik */

function googlemapload(){if("null"===typeOf(Fabrik.googleMapRadius)){var e=document.createElement("script"),t=document.location.pathname.split("/"),o=t.indexOf("index.php");-1!==o&&(t=t.slice(0,o)),t.shift(),t=t.join("/"),e.type="text/javascript",e.src=Fabrik.liveSite+"/components/com_fabrik/libs/googlemaps/distancewidget.js",document.body.appendChild(e),Fabrik.googleMapRadius=!0}document.body?window.fireEvent("google.map.loaded"):console.log("no body")}function googleradiusloaded(){document.body?window.fireEvent("google.radius.loaded"):console.log("no body")}define(["jquery","fab/element","lib/debounce/jquery.ba-throttle-debounce","fab/fabrik"],function(i,e,s,r){return window.FbGoogleMap=new Class({Extends:e,watchGeoCodeDone:!1,options:{lat:0,lat_dms:0,lon:0,lon_dms:0,zoomlevel:"13",control:"",maptypecontrol:!1,overviewcontrol:!1,scalecontrol:!1,drag:!1,maptype:"G_NORMAL_MAP",geocode:!1,latlng:!1,latlng_dms:!1,staticmap:!1,auto_center:!1,scrollwheel:!1,streetView:!1,sensor:!1,center:0,reverse_geocode:!1,use_radius:!1,geocode_on_load:!1,traffic:!1,debounceDelay:500,styles:[],directionsFrom:!1,directionsFromLat:0,directionsFromLon:0,reverse_geocode_fields:{},key:!1,mapShown:!0},loadScript:function(){r.loadGoogleMap(this.options.key,"googlemapload")},initialize:function(e,t){this.mapMade=!1,this.parent(e,t),this.options.mapShown&&(this.loadFn=function(){for(var e in this.mapTypeIds=[],google.maps.MapTypeId)this.mapTypeIds.push(google.maps.MapTypeId[e]);switch(this.mapTypeIds.push("OSM"),this.options.maptype){case"OSM":this.options.maptype="OSM";break;case"G_SATELLITE_MAP":this.options.maptype=google.maps.MapTypeId.SATELLITE;break;case"G_HYBRID_MAP":this.options.maptype=google.maps.MapTypeId.HYBRID;break;case"TERRAIN":this.options.maptype=google.maps.MapTypeId.TERRAIN;break;default:case"G_NORMAL_MAP":this.options.maptype=google.maps.MapTypeId.ROADMAP}this.makeMap(),1!==this.options.center||""!==this.options.rowid&&0!==this.options.rowid||(geo_position_js.init()?geo_position_js.getCurrentPosition(this.geoCenter.bind(this),this.geoCenterErr.bind(this),{enableHighAccuracy:!0}):fconsole("Geo location functionality not available"))}.bind(this),this.radFn=function(){this.makeRadius()}.bind(this),window.addEvent("google.map.loaded",this.loadFn),window.addEvent("google.radius.loaded",this.radFn),this.loadScript())},destroy:function(){window.removeEvent("google.map.loaded",this.loadFn),window.removeEvent("google.radius.loaded",this.radFn)},getValue:function(){return"null"!==typeOf(this.field)&&this.field.get("value")},makeMap:function(){if(!0!==this.mapMade){this.mapMade=!0;var t=this;if((void 0===this.map||null===this.map)&&"null"!==typeOf(this.element)&&((this.options.geocode||this.options.reverse_geocode)&&(this.geocoder=new google.maps.Geocoder),this.element=document.id(this.options.element),"null"!==typeOf(this.element))){if(this.field=this.element.getElement("input.fabrikinput"),this.watchGeoCode(),r.addEvent("fabrik.form.elements.added",function(e){e===t.form&&t.watchGeoCode()}),this.options.staticmap){var e=this.element.getElement("img");e.getStyle("width").toInt(),e.getStyle("height").toInt()}if(!this.options.staticmap){var o="GSmallMapControl"===this.options.control?google.maps.ZoomControlStyle.SMALL:google.maps.ZoomControlStyle.LARGE,i="none"!==this.options.control,s={center:new google.maps.LatLng(this.options.lat,this.options.lon),zoom:this.options.zoomlevel.toInt(),mapTypeId:this.options.maptype,scaleControl:this.options.scalecontrol,mapTypeControl:this.options.maptypecontrol,overviewMapControl:this.options.overviewcontrol,scrollwheel:this.options.scrollwheel,streetViewControl:this.options.streetView,zoomControl:i,zoomControlOptions:{style:o},mapTypeControlOptions:{mapTypeIds:this.mapTypeIds}};if(this.map=new google.maps.Map(document.id(this.element).getElement(".map"),s),this.map.setOptions({styles:this.options.styles}),"OSM"===this.options.maptype&&this.map.mapTypes.set("OSM",new google.maps.ImageMapType({getTileUrl:function(e,t){return"http://tile.openstreetmap.org/"+t+"/"+e.x+"/"+e.y+".png"},tileSize:new google.maps.Size(256,256),name:"OpenStreetMap",maxZoom:18})),this.options.traffic)(new google.maps.TrafficLayer).setMap(this.map);var n=new google.maps.LatLng(this.options.lat,this.options.lon),a={map:this.map,position:n};a.draggable=this.options.drag,!0===this.options.latlng&&(this.element.getElement(".lat").addEvent("blur",function(e){this.updateFromLatLng(e)}.bind(this)),this.element.getElement(".lng").addEvent("blur",function(e){this.updateFromLatLng(e)}.bind(this))),!0===this.options.latlng_dms&&(this.element.getElement(".latdms").addEvent("blur",function(e){this.updateFromDMS(e)}.bind(this)),this.element.getElement(".lngdms").addEvent("blur",function(e){this.updateFromDMS(e)}.bind(this))),this.marker=new google.maps.Marker(a),!0===this.options.latlng&&(this.element.getElement(".lat").value=this.marker.getPosition().lat()+"° N",this.element.getElement(".lng").value=this.marker.getPosition().lng()+"° E"),!0===this.options.latlng_dms&&(this.element.getElement(".latdms").value=this.latDecToDMS(),this.element.getElement(".lngdms").value=this.lngDecToDMS()),this.options.directionsFrom&&(this.directionsService=new google.maps.DirectionsService,this.directionsDisplay=new google.maps.DirectionsRenderer,this.directionsDisplay.setMap(this.map),this.directionsFromPoint=new google.maps.LatLng(this.options.directionsFromLat,this.options.directionsFromLon),this.calcRoute()),google.maps.event.addListener(this.marker,"dragend",function(){this.options.auto_center&&this.map.setCenter(this.marker.getPosition()),this.field.value=this.marker.getPosition()+":"+this.map.getZoom(),!0===this.options.latlng&&(this.element.getElement(".lat").value=this.marker.getPosition().lat()+"° N",this.element.getElement(".lng").value=this.marker.getPosition().lng()+"° E"),!0===this.options.latlng_dms&&(this.element.getElement(".latdms").value=this.latDecToDMS(),this.element.getElement(".lngdms").value=this.lngDecToDMS()),!0===this.options.latlng_osref&&(this.element.getElement(".osref").value=this.latLonToOSRef()),this.options.reverse_geocode&&this.reverseGeocode(),this.options.directionsFrom&&this.calcRoute(),r.fireEvent("fabrik.map.marker.moved",this)}.bind(this)),google.maps.event.addListener(this.map,"zoom_changed",function(e,t){this.field.value=this.marker.getPosition()+":"+this.map.getZoom()}.bind(this)),this.options.auto_center&&this.options.editable&&google.maps.event.addListener(this.map,"center_changed",function(){this.marker.setPosition(this.map.getCenter()),this.field.value=this.marker.getPosition()+":"+this.map.getZoom(),!0===this.options.latlng&&(this.element.getElement(".lat").value=this.marker.getPosition().lat()+"° N",this.element.getElement(".lng").value=this.marker.getPosition().lng()+"° E"),!0===this.options.latlng_dms&&(this.element.getElement(".latdms").value=this.latDecToDMS(),this.element.getElement(".lngdms").value=this.lngDecToDMS())}.bind(this))}this.watchTab(),r.addEvent("fabrik.form.page.change.end",function(e){this.redraw()}.bind(this)),r.fireEvent("fabrik.map.make.end",this)}}},calcRoute:function(){var e={origin:this.directionsFromPoint,destination:this.marker.getPosition(),travelMode:google.maps.TravelMode.DRIVING};this.directionsService.route(e,function(e,t){t==google.maps.DirectionsStatus.OK&&this.directionsDisplay.setDirections(e)}.bind(this))},radiusUpdatePosition:function(){},radiusUpdateDistance:function(){if(this.options.radius_write_element){var e=this.distanceWidget.get("distance");"m"===this.options.radius_unit&&(e/=1.609344),$(this.options.radius_write_element).value=parseFloat(e).toFixed(2)}},radiusActiveChanged:function(){this.options.radius_write_element&&(this.distanceWidget.get("active")||document.id(this.options.radius_write_element).fireEvent("change",new Event.Mock(document.id(this.options.radius_write_element),"change")))},radiusSetDistance:function(){if(this.options.radius_read_element){var e=document.id(this.options.radius_read_element).value;"m"===this.options.radius_unit&&(e*=1.609344);this.distanceWidget.get("sizer_position");this.distanceWidget.set("distance",e);var t=this.distanceWidget.get("center");this.distanceWidget.set("center",t)}},makeRadius:function(){if(this.options.use_radius){this.options.radius_read_element&&0<this.options.repeatCounter&&(this.options.radius_read_element=this.options.radius_read_element.replace(/_\d+$/,"_"+this.options.repeatCounter)),this.options.radius_write_element&&0<this.options.repeatCounter&&(this.options.radius_write_element=this.options.radius_write_element.replace(/_\d+$/,"_"+this.options.repeatCounter));var e=this.options.radius_default;this.options.editable?this.options.radius_read_element?e=document.id(this.options.radius_read_element).value:this.options.radius_write_element&&(e=document.id(this.options.radius_write_element).value):e=this.options.radius_ro_value,"m"===this.options.radius_unit&&(e*=1.609344),this.distanceWidget=new DistanceWidget({map:this.map,marker:this.marker,distance:e,maxDistance:2500,color:"#000000",activeColor:"#5599bb",sizerIcon:new google.maps.MarkerImage(this.options.radius_resize_off_icon),activeSizerIcon:new google.maps.MarkerImage(this.options.radius_resize_icon)}),google.maps.event.addListener(this.distanceWidget,"distance_changed",this.radiusUpdateDistance.bind(this)),google.maps.event.addListener(this.distanceWidget,"position_changed",this.radiusUpdatePosition.bind(this)),google.maps.event.addListener(this.distanceWidget,"active_changed",this.radiusActiveChanged.bind(this)),this.options.radius_fitmap&&(this.map.setZoom(20),this.map.fitBounds(this.distanceWidget.get("bounds"))),this.radiusUpdateDistance(),this.radiusUpdatePosition(),this.radiusAddActions()}},radiusAddActions:function(){this.options.radius_read_element&&document.id(this.options.radius_read_element).addEvent("change",this.radiusSetDistance.bind(this))},updateFromLatLng:function(){var e=this.element.getElement(".lat").get("value").replace("° N","");e=e.replace(",",".").toFloat();var t=this.element.getElement(".lng").get("value").replace("° E","");t=t.replace(",",".").toFloat();var o=new google.maps.LatLng(e,t);this.marker.setPosition(o),this.doSetCenter(o,this.map.getZoom(),!0)},updateFromDMS:function(){var e=this.element.getElement(".latdms"),t=e.get("value").replace("S","-");t=t.replace("N","");var o=(e=this.element.getElement(".lngdms")).get("value").replace("W","-");o=o.replace("E","");var i=t.split("°"),s=i[0],n=i[1].split("'"),a=(60*n[0].toFloat()+n[1].replace('"',"").toFloat())/3600;s=Math.abs(s.toFloat())+a.toFloat(),-1!==i[0].toString().indexOf("-")&&(s=-s);var r=o.toString().split("°"),l=r[0],d=r[1].split("'"),h=(60*Math.abs(d[0].toFloat())+Math.abs(d[1].replace('"',"").toFloat()))/3600;l=Math.abs(l.toFloat())+h.toFloat(),-1!==r[0].toString().indexOf("-")&&(l=-l);var m=new google.maps.LatLng(s.toFloat(),l.toFloat());this.marker.setPosition(m),this.doSetCenter(m,this.map.getZoom(),!0)},latDecToDMS:function(){var e=this.marker.getPosition().lat(),t=parseInt(Math.abs(e),10),o=60*(Math.abs(e).toFloat()-t.toFloat()),i=parseInt(o,10),s=(60*(o.toFloat()-i.toFloat())).toFloat();60===s&&(i=i.toFloat()+1,s=0),60===i&&(t=t.toFloat()+1,i=0);return(-1!==e.toString().indexOf("-")?"S":"N")+t+"°"+i+"'"+s+'"'},lngDecToDMS:function(){var e=this.marker.getPosition().lng(),t=parseInt(Math.abs(e),10),o=60*(Math.abs(e).toFloat()-t.toFloat()),i=parseInt(o,10),s=(60*(o.toFloat()-i.toFloat())).toFloat();60===s&&(i.value=i.toFloat()+1,s.value=0),60===i&&(t.value=t.toFloat()+1,i.value=0);return(-1!==e.toString().indexOf("-")?"W":"E")+t+"°"+i+"'"+s+'"'},latLonToOSRef:function(){return new LatLng(this.marker.getPosition().lng(),this.marker.getPosition().lng()).toOSRef().toSixFigureString()},geoCode:function(e){var o="";o="2"===this.options.geocode?(this.options.geocode_fields.each(function(e){var t=this.form.formElements.get(e);t&&(o+=t.get("value")+",")}.bind(this)),o.slice(0,-1)):this.element.getElement(".geocode_input").value;var t=new Element("div").set("html",o);o=t.get("text"),this.geocoder.geocode({address:o},function(e,t){t!==google.maps.GeocoderStatus.OK||0===e.length?fconsole(o+" not found!"):(this.options.lat=e[0].geometry.location.lat(),this.options.lon=e[0].geometry.location.lng(),this.marker.setPosition(e[0].geometry.location),this.doSetCenter(e[0].geometry.location,this.map.getZoom(),!1),this.options.reverse_geocode&&this.options.reverse_geocode_fields.formatted_address&&this.form.formElements.get(this.options.reverse_geocode_fields.formatted_address).update(e[0].formatted_address))}.bind(this))},watchGeoCode:function(){if(this.options.geocode&&this.options.editable&&void 0!==this.form&&!this.watchGeoCodeDone){if("2"===this.options.geocode)if("button"!==this.options.geocode_event){if(this.options.geocode_fields.each(function(e){var t=document.id(e);if("null"!==typeOf(t)){var o=this;this.form.formElements.get(e).options.geocomplete?r.addEvent("fabrik.element.field.geocode",function(e,t){this.geoCode()}.bind(this)):(i(t).on("keyup",s(this.options.debounceDelay,function(e){o.geoCode(e)})),t.addEvent("change",function(e){this.geoCode()}.bind(this)))}}.bind(this)),this.options.reverse_geocode_fields.formatted_address)this.form.formElements.get(this.options.reverse_geocode_fields.formatted_address).options.geocomplete&&r.addEvent("fabrik.element.field.geocode",function(e,t){if(e.element.id===this.options.reverse_geocode_fields.formatted_address){var o=new google.maps.LatLng(t.geometry.location.lat(),t.geometry.location.lng());this.marker.setPosition(o),this.doSetCenter(o,this.map.getZoom(),!1),this.fillReverseGeocode(t)}}.bind(this))}else"button"===this.options.geocode_event&&this.element.getElement(".geocode").addEvent("click",function(e){this.geoCode(e)}.bind(this));if("1"===this.options.geocode&&document.id(this.element).getElement(".geocode_input"))if("button"===this.options.geocode_event)this.element.getElement(".geocode").addEvent("click",function(e){this.geoCode(e)}.bind(this)),this.element.getElement(".geocode_input").addEvent("keypress",function(e){"enter"===e.key&&e.stop()}.bind(this));else{var t=this;i(this.element.getElement(".geocode_input")).on("keyup",s(this.options.debounceDelay,function(e){t.geoCode(e)}))}this.watchGeoCodeDone=!0}},unclonableProperties:function(){return["form","marker","map","maptype"]},cloned:function(i){var s=[];this.options.geocode_fields.each(function(e){var t=e.split("_"),o=t.getLast();if("null"===typeOf(o.toInt()))return t.join("_");t.splice(t.length-1,1,i),s.push(t.join("_"))}),this.options.geocode_fields=s,this.mapMade=!1,this.map=null,this.makeMap(),this.parent(i)},update:function(e){if((e=e.split(":")).length<2&&(e[1]=this.options.zoomlevel),this.map){var t=e[1].toInt();this.map.setZoom(t),e[0]=e[0].replace("(",""),e[0]=e[0].replace(")","");var o=e[0].split(",");o.length<2&&(o[0]=this.options.lat,o[1]=this.options.lon);var i=new google.maps.LatLng(o[0],o[1]);this.marker.setPosition(i),this.doSetCenter(i,this.map.getZoom(),!0)}},geoCenter:function(e){var t=new google.maps.LatLng(e.coords.latitude,e.coords.longitude);this.marker.setPosition(t),this.doSetCenter(t,this.map.getZoom(),!0)},geoCenterErr:function(e){fconsole("geo location error="+e.message)},redraw:function(){google.maps.event.trigger(this.map,"resize");var e=new google.maps.LatLng(this.options.lat,this.options.lon);this.map.setCenter(e),this.map.setZoom(this.map.getZoom())},fillReverseGeocode:function(e){this.options.reverse_geocode_fields.formatted_address&&this.form.formElements.get(this.options.reverse_geocode_fields.formatted_address).update(e.formatted_address);var o="",i="",s="";e.address_components.each(function(t){t.types.each(function(e){"street_number"===e?(this.options.reverse_geocode_fields.street_number||this.options.reverse_geocode_fields.route)&&(i=t.long_name):"route"===e?this.options.reverse_geocode_fields.route&&(s=t.long_name):"street_address"===e?this.options.reverse_geocode_fields.route&&(o=t.long_name):"neighborhood"===e?this.options.reverse_geocode_fields.neighborhood&&this.form.formElements.get(this.options.reverse_geocode_fields.neighborhood).update(t.long_name):"locality"===e?this.options.reverse_geocode_fields.locality&&this.form.formElements.get(this.options.reverse_geocode_fields.locality).updateByLabel(t.long_name):"administrative_area_level_1"===e?this.options.reverse_geocode_fields.administrative_area_level_1&&this.form.formElements.get(this.options.reverse_geocode_fields.administrative_area_level_1).updateByLabel(t.long_name):"postal_code"===e?this.options.reverse_geocode_fields.postal_code&&this.form.formElements.get(this.options.reverse_geocode_fields.postal_code).updateByLabel(t.long_name):"country"===e&&this.options.reverse_geocode_fields.country&&this.form.formElements.get(this.options.reverse_geocode_fields.country).updateByLabel(t.long_name)}.bind(this))}.bind(this)),this.options.reverse_geocode_fields.street_number?(this.form.formElements.get(this.options.reverse_geocode_fields.street_number).update(i),this.form.formElements.get(this.options.reverse_geocode_fields.route).update(s)):this.options.reverse_geocode_fields.route&&(""!==s&&""===o&&(o=s),""!==i&&(o=i+" "+o),this.form.formElements.get(this.options.reverse_geocode_fields.route).update(o))},reverseGeocode:function(){this.geocoder.geocode({latLng:this.marker.getPosition()},function(e,t){t===google.maps.GeocoderStatus.OK?e[0]?this.fillReverseGeocode(e[0]):window.alert("No results found"):window.alert("Geocoder failed due to: "+t)}.bind(this))},doSetCenter:function(e,t,o){this.map.setCenter(e,t),this.field.value=this.marker.getPosition()+":"+this.map.getZoom(),!0===this.options.latlng&&(this.element.getElement(".lat").value=e.lat()+"° N",this.element.getElement(".lng").value=e.lng()+"° E"),!0===this.options.latlng_dms&&(this.element.getElement(".latdms").value=this.latDecToDMS(),this.element.getElement(".lngdms").value=this.lngDecToDMS()),o&&this.options.reverse_geocode&&this.reverseGeocode()},attachedToForm:function(){this.options.geocode&&this.options.geocode_on_load&&this.geoCode(),this.parent()}}),window.FbGoogleMap});