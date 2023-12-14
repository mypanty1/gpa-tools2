Vue.component("UIBtn",{
  template:`<button @click="onClick" :disabled="disabled" :notext="notext||!text" :notshow="notshow" :value="text||'value'">{{text||'text'}}</button>`,
  props:{
    text:{type:String,default:''},
    disabled:{type:[Boolean,Number,String],default:false},
    notext:{type:[Boolean,Number,String],default:false},
    notshow:{type:[Boolean,Number,String],default:false},
  },
  methods:{
    onClick(event){
      this.$emit('click',event);
    },
  },
});
Vue.component("UIInputOld",{
  template:`<input type="text" @click="onClick" :disabled="disabled" v-model="value" v-bind="$attrs" @input="$emit('input', $event.target.value)">`,
  props:{
    text:{type:String,default:''},
    disabled:{type:[Boolean,Number,String],default:false},
  },
  data:()=>({
    value:'',
  }),
  watch:{
    'text'(text){
      this.value=text;
    },
  },
  methods:{
    onClick(event){
      this.$emit('click',event);
    },
  },
});
Vue.component("TabSection",{
  template:`<div name="TabSection"><slot></slot></div>`,
});
Vue.component("HeaderTabs",{
  template:`<div name="HeaderTabs">    
    <div tab-button v-for="(tab,i) of tabs" :key="i">
      <button tab h-24 :disabled="tab.disabled" :selected="tab.selected" @click.prevent.stop="select" :value="tab.name">{{tab.title}}</button>
    </div>
  </div>`,
  props:{},
  data:()=>({
    tabs:[
      {name:'tasks',title:'наряды',selected:false,disabled:false},
      {name:'inetcore',title:'inetcore',selected:false,disabled:false},
      {name:'actions',title:'актив',selected:true,disabled:false},
      {name:'actions2',title:'актив2',selected:false,disabled:false},
      {name:'history',title:'история',selected:false,disabled:true},
      {name:'ping54',title:'ping54',selected:false,disabled:false},
    ],
  }),
  created(){},
  methods:{
    select(event){
      let tab=this.tabs.find(tab=>tab.name===event.target.value);
      if(!tab){return};
      tab.selected=true;
      this.$emit('on-select',tab.name);
      this.unselect(tab.name);
    },
    unselect(selected){
      for(let tab of this.tabs){
        if(tab.name!==selected){
          tab.selected=false;
        };
      };
    },
  },
});
Vue.component("UIInputIp",{
  template:`<div name="UIInputIp">
    <div w-40><input type="text" v-model="ip0" ip inputmode="numeric" placeholder="xxx"></div>
    <span dot>.</span>
    <div w-40><input type="text" v-model="ip1" ip inputmode="numeric" placeholder="xxx"></div>
    <span dot>.</span>
    <div w-40><input type="text" v-model="ip2" ip inputmode="numeric" placeholder="xxx"></div>
    <span dot>.</span>
    <div w-40><input type="text" v-model="ip3" ip inputmode="numeric" placeholder="xxx"></div>
  </div>`,
  props:{
    ip:{type:String,default:''},
  },
  data:()=>({
    ip0:'',
    ip1:'',
    ip2:'',
    ip3:'',
  }),
  created(){
    this.setIP();
  },
  watch:{
    'ip'(ip){
      this.setIP();
    },
    'validIp'(validIp){
      this.$emit('on-valid-ip',validIp);
    },
    'ip0'(octet){
      this.ip0=this.validateOctet(octet);
    },
    'ip1'(octet){
      this.ip1=this.validateOctet(octet);
    },
    'ip2'(octet){
      this.ip2=this.validateOctet(octet);
    },
    'ip3'(octet){
      this.ip3=this.validateOctet(octet);
    },
  },
  computed:{
    validIp(){
      return this.validateIp([this.ip0,this.ip1,this.ip2,this.ip3].join('.'));
    },
  },
  methods:{
    setIP(){
      if(this.ip){
        let sample=this.ip.split('.');
        this.ip0=sample[0]||this.ip0;
        this.ip1=sample[1]||this.ip1;
        this.ip2=sample[2]||this.ip2;
        this.ip3=sample[3]||this.ip3;
      }
    },
    validateIp(sample=''){
      let valid=sample.match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/);
      return (valid&&valid[0])||'';
    },
    validateOctet(sample=''){
      let valid=sample.match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/);
      return (valid&&valid[0])||'';
    }
  },
});
Vue.component("ActionsContent",{
  template:`<div name="ActionsContent">
    <div services-tabs>    
      <div tab-button v-for="(tab,i) of tabs" :key="i">
        <button tab h-40 :disabled="tab.disabled" :selected="tab.selected" @click.prevent.stop="select" :value="tab.name">{{tab.title}}</button>
      </div>
    </div>
    
    <template v-if="tab">
      <template v-if="tab==='spd'">
        <div row>
          <div w-100>ESw IP</div>
          <UIInputIp ip="10.221" @on-valid-ip="(valid)=>{spd.sw_ip=valid}"/>
        </div>
        <div row>
          <div w-100>ESw Port</div>
          <select v-model="spd.port" w-40>
            <option selected></option>
            <option v-for="port of spd.ports">{{port}}</option>
          </select>
          <div w-40 ml-10><UIInputOld ip v-model="spd.sw_port" :text="spd.sw_port" placeholder="xx"/></div>
          <div w-40 ml-10><UIBtn @click="send_fp" text="fp" :disabled="!spd.sw_ip"></div>
        </div>
        <div row>
          <div w-100>Abon IP</div>
          <UIInputIp :ip="spd.ab_ip||'10'" @on-valid-ip="(valid)=>{spd.ab_ip=valid}"/>
        </div>
        <div action-btn mt-20>
          <div w-100>
            <UIBtn text="bind port" @click="bind_port" :disabled="!(spd.sw_ip&&spd.ab_ip&&spd.sw_port)"/>
          </div>
        </div>
        
        <div row mt-30>
          <div w-100>CPE Serial</div>
          <div w-150><UIInputOld v-model="spd.cpe_sn" placeholder="serial number"/></div>
          <div w-75 ml-10>
            <UIBtn text="hardturn" @click="hardturn_cpe" :disabled="!(spd.cpe_sn&&spd.spd_id)"/>
          </div>
        </div>
        <div row>
          <div w-100>CPE Model</div>
          <select v-model="spd.model" w-40>
            <option selected></option>
            <option v-for="model of spd.models">{{model}}</option>
          </select>
          <div w-150 ml-10><UIInputOld v-model="spd.cpe_model" :text="spd.cpe_model" placeholder="model code"/></div>
        </div>
        <div row>
          <div w-100>Abon ID</div>
          <div w-100><UIInputOld v-model="spd.spd_id" :text="spd.spd_id" placeholder="service id"/></div>
          <div w-75 ml-10>
            <UIBtn text="activate" @click="activate_spd" :disabled="!spd.spd_id"/>
          </div>
        </div>
        <div action-btn mt-20>
          <div w-75>
            <UIBtn text="status" @click="status_cpe" :disabled="!spd.cpe_sn"/>
          </div>
          <div w-100>
            <UIBtn text="bind CPE" @click="bind_cpe" :disabled="!(spd.cpe_sn&&spd.spd_id)"/>
          </div>
        </div>
        
        <div row mt-30>
          <div w-100>Abon IP</div>
          <UIInputIp :ip="spd.ab_ip||'10'" @on-valid-ip="(valid)=>{spd.ab_ip=valid}"/>
        </div>
        <div row>
          <div w-100>Abon ID</div>
          <div w-100><UIInputOld v-model="spd.spd_id" :text="spd.spd_id" placeholder="service id"/></div>
          <div w-75 ml-10>
            <UIBtn text="activate" @click="activate_spd" :disabled="!spd.spd_id"/>
          </div>
        </div>
        <div action-btn mt-20>
          <div w-75>
            <UIBtn text="bind IP" @click="bind_ip" :disabled="!(spd.ab_ip&&spd.spd_id)"/>
          </div>
        </div>
        
      </template>
      <template v-else-if="tab==='ctv'">
        <div row>
          <div w-100>Abon ID</div>
          <div w-100><UIInputOld v-model="ctv.ctv_id" :text="ctv.ctv_id" placeholder="service id"/></div>
        </div>
        <div row>
          <div w-100>Smart Card</div>
          <div w-150><UIInputOld v-model="ctv.card" placeholder="smart card id"/></div>
          <div w-75 ml-10>
            <UIBtn text="hardturn" @click="hardturn_card" :disabled="!(ctv.card&&ctv.ctv_id)"/>
          </div>
        </div>
        <div row>
          <div w-100>Chip ID</div>
          <div w-150><UIInputOld v-model="ctv.chip" placeholder="chip id"/></div>
          <div w-75 ml-10>
            <UIBtn text="hardturn" @click="hardturn_chip" :disabled="!(ctv.chip&&ctv.ctv_id)"/>
          </div>
        </div>
        <div row>
          <div w-100>Model</div>
          <select v-model="ctv.type" w-40>
            <option selected></option>
            <option v-for="type of ctv.types">{{type}}</option>
          </select>
          <select v-model="ctv.model" w-40 ml-10>
            <option selected></option>
            <option v-for="model of ctv.models">{{model}}</option>
          </select>
          <div w-100 ml-10><UIInputOld v-model="ctv.ctv_model" :text="ctv.ctv_model" placeholder="model code"/></div>
        </div>
        <div action-btn mt-20>
          <div w-75>
            <UIBtn text="status" @click="status_ctv" :disabled="!(ctv.card||ctv.chip)"/>
          </div>
          <div w-50>
            <UIBtn text="ROP" @click="rop" :disabled="!ctv.card"/>
          </div>
          <div w-75>
            <UIBtn text="hardset" @click="hardset_ctv" :disabled="!((ctv.card&&ctv.ctv_id)||(ctv.chip&&ctv.ctv_id&&ctv.ctv_model&&ctv.type))"/>
          </div>
          <div w-75>
            <UIBtn text="activate" @click="activate_ctv" :disabled="!(ctv.card&&ctv.chip&&ctv.ctv_id&&ctv.ctv_model&&ctv.type)"/>
          </div>
        </div>
      </template>
      <template v-else-if="tab==='itv'">
        <div row>
          <div w-100>STB Serial</div>
          <div w-150><UIInputOld v-model="itv.itv_sn" placeholder="serial number"/></div>
          <div w-75 ml-10>
            <UIBtn text="hardturn" @click="hardturn_itv" :disabled="!(itv.itv_sn&&itv.itv_id)"/>
          </div>
        </div>
        <div row>
          <div w-100>STB Model</div>
          <select v-model="itv.model" w-40>
            <option selected></option>
            <option v-for="model of itv.models">{{model}}</option>
          </select>
          <div w-150 ml-10><UIInputOld v-model="itv.itv_model" :text="itv.itv_model" placeholder="model code"/></div>
        </div>
        <div row>
          <div w-100>Abon ID</div>
          <div w-100><UIInputOld v-model="itv.itv_id" :text="itv.itv_id" placeholder="service id"/></div>
        </div>
        <div action-btn mt-20>
          <div w-75>
            <UIBtn text="status" @click="status_itv" :disabled="!itv.itv_sn"/>
          </div>
          <div w-100>
            <UIBtn text="bind STB" @click="bind_itv" :disabled="!(itv.itv_sn&&itv.itv_id)"/>
          </div>
        </div>
      </template>
      <template v-else-if="tab==='voip'">
        <div row>
          <div w-100>CPE Serial</div>
          <div w-150><UIInputOld v-model="voip.voip_sn" placeholder="serial number"/></div>
          <div w-75 ml-10>
            <UIBtn text="hardturn" @click="hardturn_cpe_voip" :disabled="!(voip.voip_sn&&voip.voip_id)"/>
          </div>
        </div>
        <div row>
          <div w-100>CPE Model</div>
          <select v-model="voip.model" w-40>
            <option selected></option>
            <option v-for="model of voip.models">{{model}}</option>
          </select>
          <div w-150 ml-10><UIInputOld v-model="voip.voip_model" :text="voip.voip_model" placeholder="model code"/></div>
        </div>
        <div row>
          <div w-100>Abon ID</div>
          <div w-100><UIInputOld v-model="voip.voip_id" :text="voip.voip_id" placeholder="service id"/></div>
          <div w-75 ml-10>
            <UIBtn text="activate" @click="activate_voip" :disabled="!voip.voip_id"/>
          </div>
        </div>
        <div action-btn mt-20>
          <div w-75>
            <UIBtn text="status" @click="status_cpe_voip" :disabled="!voip.voip_sn"/>
          </div>
          <div w-100>
            <UIBtn text="bind CPE" @click="bind_cpe_voip" :disabled="!(voip.voip_sn&&voip.voip_id)"/>
          </div>
        </div>
      </template>
    </template>
    <template v-else><span ta-c>?</span></template>
  </div>`,
  data:()=>({
    tabs:[
      {name:'spd',title:'ШПД',selected:true,disabled:false},
      {name:'ctv',title:'ЦТВ',selected:false,disabled:false},
      {name:'itv',title:'ИТВ',selected:false,disabled:false},
      {name:'voip',title:'VoIP',selected:false,disabled:false},
    ],
    tab:'spd',
    spd:{
      sw_ip:'',
      ab_ip:'',
      ports:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52],
      port:'',
      sw_port:'',
      cpe_sn:'',
      models:['CH-H01','DJT11LM','HM1S-G01','HM2-G01','MCCGQ11LM','AMwhite','RTCGQ11LM','SJCGQ11LM','SP-EUC01','WRS-R02','WSDCGQ11LM','ZNLDP12LM','WG430223','MP112','MP202','DGS5AE1','DL300','DL300a','DL320','DL615','DIR815','DL822','DIR822v2','DL822v2','DIR822v3','DIR-842S','DIR-842','DIR-842SRU','DSL2640UR1A','DSL2640URB','DVG7111','DLN5402','RG1404','RG4402','EZC1C','EZC3WN','ONU AN5506-04-DG','AN5506-04-GG','FHAN5506-04-GG','HG6143D','HG6244C','1041ac2v2s','1041','1041v2','1041v2s','QBR1241','QDSL1040','QVI2102','QVI2108','SF2804','FF2804','FST3804','S1010','AC5PRO','TS-7022','MIAX1800','MIAX3600','NL45BT','YLDP005','ZNID2727','ZNID2727BU','F660','F668','H298N','B866OTT','B866OTTv3','IC5670','SCM2CPE','DIR320','ALICEmini',"GMR4015GL","360HSC2K","YTC4041GL","YTC4039GL","YTC4043GL","MUE4115GL","GPX4026GL","GPX4021GL","YTC4040GL","YTC4044GL","NUN4126GL","SKV4140GL","NUN4048GL","NUN4056GL","BHR4558GL"],
      model:'',
      cpe_model:'',
      spd_id:'',
    },
    ctv:{
      ctv_id:'',
      card:'',
      chip:'',
      models:['IRDETO','IRDSa','IRDSm','IRD','IRD5','IRD5v2','IRD50005','IRD50005v2','2040','C-5100','S2','dc601','2204','2304','4404','4404v2','TV251','TV251P','NL6001R','OC6306','HSD11','TV101'],
      model:'',
      ctv_model:'',
      types:['C','D','S','K'],
      type:'',
    },
    itv:{
      itv_id:'',
      models:['DV8304C','DV9157C','DC300a','A110','A130','GIU6390','DID7005','DTP9514','VIP1003','SL282B','SL292P','SML482','ZTEB7','ZXV10B866','ZXV10B866v2','B866V3','DCD5325'],
      model:'',
      itv_model:'',
    },
    voip:{
      voip_sn:'',
      models:['H298N','AN5506-04-GG','MP112','MP202','DVG7111','DLN5402','DLN5402-1S','DLN5402-2S','RG1404','RG4402','QBR1241','QVI2102','QVI2108','FST3804','F660','F668'],
      model:'',
      voip_model:'',
      voip_id:''
    },
  }),
  watch:{
    'spd.port'(port){if(!port){return};this.spd.sw_port=port+'';this.spd.port=''},
    'spd.model'(model){if(!model){return};this.spd.cpe_model=model+'';this.spd.model=''},
    'ctv.model'(model){if(!model){return};this.ctv.ctv_model=model+'';this.ctv.model=''},
    'itv.model'(model){if(!model){return};this.itv.itv_model=model+'';this.itv.model=''},
    'voip.model'(model){if(!model){return};this.voip.voip_model=model+'';this.voip.model=''},
  },
  methods:{
    sendSms(text){
      //console.log('do:sendSms:direct:${this.getPhoneWithPlus(this.phone)}=',text);
      if(window.AppInventor&&window.AppInventor.setWebViewString){
        window.AppInventor.setWebViewString('do:sendSms:direct:+79139801727='+text);
      }else{
        window.open('sms:+79139801727?body='+encodeURIComponent(text),'_blank');
      };
    },
    send_fp(){
      if(!this.spd.sw_ip){return};
      this.sendSms(`fp ${this.spd.sw_ip}`);
    },
    bind_port(){
      if(!(this.spd.sw_ip&&this.spd.ab_ip&&this.spd.sw_port)){return};
      this.sendSms(`ip:${this.spd.sw_ip}\nport:${this.spd.sw_port}\nclient:${this.spd.ab_ip}`);
    },
    activate_spd(){
      if(!this.spd.spd_id){return};
      this.sendSms(`activatespd ${this.spd.spd_id}`);
    },
    hardturn_cpe(){
      if(this.spd.cpe_sn&&this.spd.spd_id){this.sendSms(`hardturn ${this.spd.cpe_sn} ${this.spd.spd_id}`);};
    },
    bind_cpe(){
      if(!(this.spd.cpe_sn&&this.spd.spd_id)){return};
      this.sendSms(`wf r${this.spd.cpe_sn} ${this.spd.spd_id} ${this.spd.cpe_model}`);
    },
    status_cpe(){
      if(!this.spd.cpe_sn){return};
      this.sendSms(`status ${this.spd.cpe_sn}`);
    },
    bind_ip(){
      if(!(this.spd.ab_ip&&this.spd.spd_id)){return};
      this.sendSms(`bindip ${this.spd.spd_id} ${this.spd.ab_ip}`);
    },
    status_ctv(){
      if(this.ctv.card){this.sendSms(`status ${this.ctv.card}`);};
      setTimeout(()=>{if(this.ctv.chip){this.sendSms(`status ${this.ctv.chip}`);};},1000);
      
    },
    rop(){
      if(this.ctv.card){this.sendSms(`${this.ctv.card}`);};
    },
    activate_ctv(){
      if(!(this.ctv.card&&this.ctv.chip&&this.ctv.type&&this.ctv.ctv_model&&this.ctv.ctv_id)){return};
      this.sendSms(`${this.ctv.card} ${this.ctv.type}${this.ctv.chip} ${this.ctv.ctv_id} ${this.ctv.ctv_model}`);
    },
    hardset_ctv(){
      if(this.ctv.chip&&this.ctv.type&&this.ctv.ctv_model&&this.ctv.ctv_id){this.sendSms(`hardset ${this.ctv.type}${this.ctv.chip} ${this.ctv.ctv_id} ${this.ctv.ctv_model}`);};
      setTimeout(()=>{if(this.ctv.card&&this.ctv.ctv_id){this.sendSms(`hardset k${this.ctv.card} ${this.ctv.ctv_id} nomodel`);};},1000);
    },
    hardturn_card(){
      if(this.ctv.card&&this.ctv.ctv_id){this.sendSms(`hardturn ${this.ctv.card} ${this.ctv.ctv_id}`);};
    },
    hardturn_chip(){
      if(this.ctv.chip&&this.ctv.ctv_id){this.sendSms(`hardturn ${this.ctv.chip} ${this.ctv.ctv_id}`);};
    },
    bind_itv(){
      if(!(this.itv.itv_sn&&this.itv.itv_id)){return};
      this.sendSms(`i ${this.itv.itv_sn} ${this.itv.itv_id} ${this.itv.itv_model}`);
    },
    status_itv(){
      if(!this.itv.itve_sn){return};
      this.sendSms(`status ${this.itv.itv_sn}`);
    },
    hardturn_itv(){
      if(this.itv.itv_sn&&this.itv.itv_id){this.sendSms(`hardturn ${this.itv.itv_sn} ${this.itv.itv_id}`);};
    },
    activate_voip(){
      if(!this.voip.voip_id){return};
      this.sendSms(`voip ${this.voip.voip_id}`);
    },
    bind_cpe_voip(){
      if(!(this.voip.voip_sn&&this.voip.voip_id)){return};
      this.sendSms(`wf v${this.voip.voip_sn} ${this.voip.voip_id} ${this.voip.voip_model}`);
    },
    hardturn_cpe_voip(){
      if(this.voip.voip_sn&&this.voip.voip_id){this.sendSms(`hardturn ${this.voip.voip_sn} ${this.voip.voip_id}`);};
    },
    status_cpe_voip(){
      if(!this.voip.voip_sn){return};
      this.sendSms(`status ${this.voip.voip_sn}`);
    },
    select(event){
      let tab=this.tabs.find(tab=>tab.name===event.target.value);
      if(!tab){return};
      this.tab=tab.name;
      tab.selected=true;
      this.unselect(tab.name);
    },
    unselect(selected){
      for(let tab of this.tabs){
        if(tab.name!==selected){
          tab.selected=false;
        };
      };
    },
  },
});
Vue.component("Actions2Content",{
  template:`<div name="Actions2Content">
    <div services-tabs>    
      <div tab-button v-for="(tab,i) of tabsServices" :key="i">
        <button tab h-40 :disabled="tab.disabled" :selected="tab.selected" @click.prevent.stop="selectService" :value="tab.name">{{tab.title}}</button>
      </div>
    </div>
    
    <template v-if="service">
      <div actions-tabs>    
        <div tab-button v-for="(tab,i) of tabsActions" :key="i">
          <button tab h-40 :disabled="tab.disabled" :selected="tab.selected" @click.prevent.stop="selectAction" :value="tab.name">{{tab.title}}</button>
        </div>
      </div>
      
      <template v-if="service==='ctv'">
        <template v-if="action==='add'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>SmartCardNumber</div><UIInput v-model="SmartCardNumber"/></div>
          <div row><div w-200>HardType</div><UISelect v-model="HardType" :items="hardTypes" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>Model</div><UISelect v-model="Model" :items="models" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>UsageType</div><UISelect v-model="UsageType" :items="usageTypes" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else-if="action==='replace'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardType</div><UISelect v-model="HardType" :items="hardTypes" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>Model</div><UISelect v-model="Model" :items="models" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>UsageType</div><UISelect v-model="UsageType" :items="usageTypes" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else-if="action==='delete'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else><span style="text-align:center;">нет действия</span></template>
      </template>
      <template v-else-if="service==='spd'">
        <template v-if="action==='activate'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else-if="action==='add'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>Model</div><UISelect v-model="Model" :items="models" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>UsageType</div><UISelect v-model="UsageType" :items="usageTypes" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else-if="action==='delete'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else><span style="text-align:center;">нет действия</span></template>
      </template>
      <template v-else-if="service==='itv'">
        <template v-if="action==='add'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>Model</div><UISelect v-model="Model" :items="models" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>UsageType</div><UISelect v-model="UsageType" :items="usageTypes" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else-if="action==='delete'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else><span style="text-align:center;">нет действия</span></template>
      </template>
      <template v-else-if="service==='iptv'"><span style="text-align:center;">нет действия</span></template>
      <template v-else-if="service==='voip'">
        <template v-if="action==='add'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>Model</div><UISelect v-model="Model" :items="models" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>UsageType</div><UISelect v-model="UsageType" :items="usageTypes" itemKey="value" inputByKey  clearable/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else-if="action==='delete'">
          <div row><div w-200>LS</div><UIInput v-model="LS"/></div>
          <div row><div w-200>HardNumber</div><UIInput v-model="HardNumber"/></div>
          <div row><div w-200>ContractID</div><UIInput v-model="ContractID"/></div>
        </template>
        <template v-else><span style="text-align:center;">нет действия</span></template>
      </template>
      
      <div action-btn v-if="action" style="margin-top:20px;">
        <div w-100>
          <UIBtn v-if="(action==='activate')&&['spd'].includes(service)" text="активация" @click="activate"/>
          <UIBtn v-else-if="(action==='replace')&&['ctv'].includes(service)" text="замена AO" @click="replace"/>
          <UIBtn v-else-if="(action==='add')&&['ctv','spd','itv','voip'].includes(service)" text="привязка AO" @click="add"/>
          <UIBtn v-else-if="(action==='delete')&&['ctv','spd','itv','voip'].includes(service)" text="отвязка AO" @click="delete_eq"/>
        </div>
      </div>
      
    </template>
    <template v-else><span style="text-align:center;">услуга?</span></template>
  </div>`,
  data:()=>({
    LS:'',
    SmartCardNumber:'',
    HardType:'',
    HardNumber:'',
    Model:'',
    UsageType:'',
    ContractID:'',
    tabsServices:[
      {name:'ctv',title:'ЦТВ',selected:true,disabled:false},
      {name:'spd',title:'ШПД',selected:false,disabled:false},
      {name:'itv',title:'ИТВ',selected:false,disabled:false},
      {name:'iptv',title:'IPTV',selected:false,disabled:true},
      {name:'voip',title:'VoIP',selected:false,disabled:false},
    ],
    tabsActions:[
      {name:'activate',title:'активация',selected:false,disabled:false},
      {name:'replace',title:'замена AO',selected:false,disabled:false},
      {name:'add',title:'привязка AO',selected:true,disabled:false},
      {name:'delete',title:'отвязка AO',selected:false,disabled:false},
    ],
    service:'ctv',
    action:'add',
    usageTypes:[
      {value:'*',label:'без проверки'},
      {value:'SOB',label:'собственное'},
      {value:'PROD',label:'продажа нового'},
      {value:'ARENDA',label:'аренда нового'},
      {value:'PRODBU',label:'продажа б/у'},
      {value:'ARENDABU',label:'аренда б/у'},
    ],
    hardTypes:[
      {value:'C',label:'САМ-модуль'},
      {value:'D',label:'HD приставка'},
      {value:'S',label:'SD приставка'},
      {value:'K',label:'смарт-карта'},
    ],
    models:[
      {value:'A110',label:'Amino A110'},
      {value:'A130',label:'Amino A130'},
      {value:'GIU6390',label:'Changhong GIU6390'},
      {value:'DID7005',label:'DID7005'},
      {value:'DC300astb',label:'Huawei DC300a'},
      {value:'DTP9514',label:'Jiuzhou DTP9514'},
      {value:'VIP1003',label:'MOTOROLA VIP1003G'},
      {value:'SL282B',label:'Smartlabs SML-282 Base'},
      {value:'SL292P',label:'Smartlabs SML-292 Premium'},
      {value:'SML482',label:'STB SML-482'},
      {value:'DV8304-Cstb',label:'SuperWave DV8304-C 4K Android'},
      {value:'ZTEB7',label:'ZTE ZXB700V7'},
      {value:'ZXV10B866',label:'ZTE ZXV10 B866 Android'},
      {value:'ZXV10B866v2',label:'ZTE ZXV10 B866 v2 Android'},
      {value:'B866V3',label:'ZTE ZXV10 B866 v3 Android'},
      {value:'IRDETO',label:'CAM IRDETO'},
      {value:'IRDSa',label:'CAM IRDETO (Спутниковое ТВ)'},
      {value:'IRDSm',label:'CAM IRDETO SMIT'},
      {value:'IRD',label:'SMIT CAM-IRD 4000'},
      {value:'IRD5',label:'SMIT CAM-IRD 4000/5'},
      {value:'IRD5v2',label:'SMIT CAM-IRD 4000/5 v2'},
      {value:'IRD50005',label:'SMIT CAM-IRD 5000/5'},
      {value:'IRD50005v2',label:'SMIT CAM-IRD 5000/5 v2'},
      {value:'2040',label:'Avit C-2040'},
      {value:"C-5100",label:"Avit С-5100"},
      {value:'S2',label:'Avit S2-3220'},
      {value:'dc601',label:'Castpal DC601'},
      {value:'2204',label:'DCD2204'},
      {value:'2304',label:'DCD2304'},
      {value:'4404',label:'DCD4404'},
      {value:'4404v2',label:'DCD4404v2'},
      {value:'TV251',label:'Dune HD TV 251-S2 MTS Lite'},
      {value:'TV251P',label:'Dune HD TV 251-S2 MTS Lite Plus'},
      {value:'NL6001R',label:'Newland NL-6001R'},
      {value:'OC6306',label:'Orient OC6306'},
      {value:'HSD11',label:'SkyWorth HSD11'},
      {value:'TV101',label:'TV-101'},
      {value:'DCD5325',label:'DCD5325'},
      {value:'DID7005stb',label:'DID7005vCS'},
      {value:'DC300a',label:'Huawei DC300a'},
      {value:'DV8304C',label:'SuperWave DV8304-C 4K Android'},
      {value:'DV9157C',label:'SDMC DV9157-C 4K Android'},
      {value:'ZTEB7stb',label:'ZTE ZXB700V7'},
      {value:'B866stb',label:'ZTE ZXV10 B866 Android'},
      {value:'nomodel',label:'без модели'},
      {value:'CH-H01',label:'Aqara CH-H01 (датчик)'},
      {value:'DJT11LM',label:'Aqara DJT11LM (датчик)'},
      {value:'HM1S-G01',label:'Aqara HM1S-G01, хаб M1S'},
      {value:'HM2-G01',label:'Aqara HM2-G01, хаб M2'},
      {value:'MCCGQ11LM',label:'Aqara MCCGQ11LM (датчик)'},
      {value:'AMwhite',label:'Aqara Mini (датчик)'},
      {value:'RTCGQ11LM',label:'Aqara RTCGQ11LM (датчик)'},
      {value:'SJCGQ11LM',label:'Aqara SJCGQ11LM (датчик)'},
      {value:'SP-EUC01',label:'Aqara SP-EUC01 (датчик)'},
      {value:'WRS-R02',label:'Aqara WRS-R02 (датчик)'},
      {value:'WSDCGQ11LM',label:'Aqara WSDCGQ11LM (датчик)'},
      {value:'ZNLDP12LM',label:'Aqara ZNLDP12LM (датчик)'},
      {value:'WG430223',label:'Arcadyan WG430223'},
      {value:'MP112',label:'AudioCodes MP-112/2S/SIP'},
      {value:'MP202',label:'AudioCodes MP-202B/2S/SIP'},
      {value:'DGS5AE1',label:'D-Link DGS-1005A/E1'},
      {value:'DL300',label:'D-Link DIR-300'},
      {value:'DL300a',label:'D-Link DIR-300A'},
      {value:'DL320',label:'D-Link DIR-320'},
      {value:'DL615',label:'D-Link DIR-615'},
      {value:'DIR815',label:'D-Link DIR-815'},
      {value:'DL822',label:'D-Link DIR-822'},
      {value:'DIR822v2',label:'D-Link DIR-822 v2'},
      {value:'DL822v2',label:'D-Link DIR-822 v2'},
      {value:'DIR822v3',label:'D-Link DIR-822 v3'},
      {value:'DIR-842S',label:'D-Link DIR-842 (DIR-825)/SMTS/S1A'},
      {value:'DIR-842',label:'D-Link DIR-842/RU/R1A'},
      {value:'DIR-842SRU',label:'D-Link DIR-842/SMTS (SRU)'},
      {value:'DSL2640UR1A',label:'D-Link DSL-2640U R1A (adsl)'},
      {value:'DSL2640URB',label:'D-Link DSL-2640U RB (adsl)'},
      {value:'DVG7111',label:'D-Link DVG-7111S'},
      {value:'DLN5402',label:'D-Link DVG-N5402SP'},
      {value:'RG1404',label:'Eltex RG-1404G'},
      {value:'RG4402',label:'Eltex RG-4402G-W'},
      {value:'EZC1C',label:'Ezviz C1C (камера)'},
      {value:'EZC3WN',label:'Ezviz C3WN (камера)'},
      {value:'ONU AN5506-04-DG',label:'FiberHome AN5506-04-DG(U) (gpon)'},
      {value:'AN5506-04-GG',label:'FiberHome AN5506-04-GG(U) (gpon)'},
      {value:'FHAN5506-04-GG',label:'FiberHome AN5506-04-GG(U) (gpon)'},
      {value:'HG6143D',label:'FiberHome HG6143D (gpon)'},
      {value:'HG6244C',label:'FiberHome HG6244C (gpon)'},
      {value:'1041ac2v2s',label:'Qtech QBR-1041W-AC2v2S'},
      {value:'1041',label:'Qtech QBR-1041WU'},
      {value:'1041v2',label:'Qtech QBR-1041WUv2'},
      {value:'1041v2s',label:'Qtech QBR-1041WUv2s'},
      {value:'QBR1241',label:'Qtech QBR-1241WU/L'},
      {value:'QDSL1040',label:'Qtech QDSL-1040WU'},
      {value:'QVI2102',label:'Qtech QVI-2102'},
      {value:'QVI2108',label:'Qtech QVI-2108'},
      {value:'SF2804',label:'Sagemcom Fast 2804 v.3'},
      {value:'FF2804',label:'Sagemcom Fast 2804 v.3 (МТС)'},
      {value:'FST3804',label:'Sagemcom Fast 3804 v.2'},
      {value:'S1010',label:'Sercomm S1010'},
      {value:'AC5PRO',label:'TP-Link Archer C5 Pro'},
      {value:'TS-7022',label:'TransService TS-7022'},
      {value:'MIAX1800',label:'Xiaomi Mi Router AX1800'},
      {value:'MIAX3600',label:'Xiaomi Mi Router AX3600'},
      {value:'NL45BT',label:'Yeelight Rechargeable Nightlight сенсорная, 4.5Вт'},
      {value:'YLDP005',label:'Yeelight Smart LED Bulb W3(Multiple color) YLDP005'},
      {value:'ZNID2727',label:'ZNID-GPON-2727A1-EU (gpon)'},
      {value:'ZNID2727BU',label:'ZNID-GPON-2727A1-EU (БУ) (gpon)'},
      {value:'F660',label:'ZTE ZXHN F660 (gpon)'},
      {value:'F668',label:'ZTE ZXHN F668 (gpon)'},
      {value:'H298N',label:'ZTE ZXHN H298N'},
      {value:'B866OTT',label:'ZTE ZXV10 B866 Android (ОТТ)'},
      {value:'B866OTTv3',label:'ZTE ZXV10 B866 v3 Android (OTT)'},
      {value:'IC5670',label:'Интеркросс ICxETH5670NE'},
      {value:'SCM2CPE',label:'Маршрутизатор SNR-CPE-ME2'},
      {value:'DIR320',label:'МТС DIR-320'},
      {value:'ALICEmini',label:'Станция мини с голосовым ассистентом Алиса'},
      {value:'SC',label:'Coship N5266C'},
      {value:'S3011',label:'DСD3011'},
      {value:'WC112',label:'WC-112 WinBox'},
      {value:'MP112',label:'AudioCodes MP-112/2S/SIP'},
      {value:'MP202',label:'AudioCodes MP-202B/2S/SIP'},
      {value:'DVG7111',label:'D-Link DVG-7111S'},
      {value:'DLN5402',label:'D-Link DVG-N5402SP'},
      {value:'DLN5402-1S',label:'D-Link DVG-N5402SP/1S HW rev. C1A'},
      {value:'DLN5402-2S',label:'D-Link DVG-N5402SP/2S1U HW rev. С1'},
      {value:'RG1404',label:'Eltex RG-1404G'},
      {value:'RG4402',label:'Eltex RG-4402G-W'},
      {value:'AN5506-04-GG',label:'FiberHome AN5506-04-GG(U) (gpon)'},
      {value:'QBR1241',label:'Qtech QBR-1241WU/L'},
      {value:'QVI2102',label:'Qtech QVI-2102'},
      {value:'QVI2108',label:'Qtech QVI-2108'},
      {value:'FST3804',label:'Sagemcom Fast 3804 v.2'},
      {value:'F660',label:'ZTE ZXHN F660 (gpon)'},
      {value:'F668',label:'ZTE ZXHN F668 (gpon)'},
      {value:'H298N',label:'ZTE ZXHN H298N'},
      
      {value: "GMR4015GL", label: "Xiaomi Mi GMR4015GL"},
      {value: "360HSC2K", label: "Xiaomi Mi 360 Home Security Camera 2K"},
      {value: "YTC4041GL", label: "Xiaomi Mi Motion Sensor YTC4041GL"},
      {value: "YTC4039GL", label: "Xiaomi Mi YTC4039GL"},
      {value: "YTC4043GL", label: "Xiaomi Mi YTC4043GL"},
      {value: "MUE4115GL", label: "Xiaomi Mi Night Light 2 (MUE4115GL)"},
      {value: "GPX4026GL", label: "Xiaomi Mi Smart Bulb GPX4026GL,белый"},
      {value: "GPX4021GL", label: "Xiaomi Mi Smart Bulb GPX4021GL,цвет"},
      {value: "YTC4040GL", label: "Xiaomi Mi Wireless Switch YTC4040GL"},
      {value: "YTC4044GL", label: "Xiaomi Mi Smart Home Hub YTC4044GL"},
      {value: "NUN4126GL", label: "Xiaomi Mi 2 NUN4126GL"},
      {value: "SKV4140GL", label: "Умный увлажнитель Xiaomi Humidifier SKV4140GL"},
      {value: "NUN4048GL", label: "Умные весы Xiaomi Body Composition NUN4048GL"},
      {value: "NUN4056GL", label: "Умные весы Xiaomi Smart Scale NUN4056GL"},
      {value: "BHR4558GL", label: "Диспенсер и блок Xiaomi Dispenser BHR4558GL"}
    ],
  }),
  methods:{
    sendSms(text){
      //console.log('do:sendSms:direct:${this.getPhoneWithPlus(this.phone)}=',text);
      if(window.AppInventor&&window.AppInventor.setWebViewString){
        window.AppInventor.setWebViewString('do:sendSms:direct:+79154300451='+text);
      }else{
        window.open('sms:+79154300451?body='+encodeURIComponent(text),'_blank');
      };
    },
    activate(){
      if(!this.LS){return};
      switch(this.service){
        case 'spd':
          this.sendSms(`SPD ${this.LS} * ${this.ContractID||'*'}`);
        break;
        default:return;
      };
    },
    replace(){
      if(!this.LS){return};
      if(!this.HardType){return};
      if(!this.HardNumber){return};
      if(!this.Model){return};
      switch(this.service){
        case 'ctv':
          this.sendSms(`CTVCHANGE ${this.LS} ${this.HardType}${this.HardNumber} ${this.Model} * ${this.UsageType||'*'} * ${this.ContractID||'*'}`);
        break;
        default:return;
      };
    },
    add(){
      if(!this.LS){return};
      if(!this.HardNumber){return};
      if(!this.Model){return};
      switch(this.service){
        case 'ctv':
          if(!this.SmartCardNumber){return};
          if(!this.HardType){return};
          this.sendSms(`CTV ${this.LS} ${this.SmartCardNumber} ${this.HardType}${this.HardNumber} ${this.Model} * ${this.UsageType||'*'} * ${this.ContractID||'*'}`);
        break;
        case 'spd':
          this.sendSms(`WIFI ${this.LS} ${this.HardNumber} ${this.Model} ${this.UsageType||'*'} * ${this.ContractID||'*'}`);
        break;
        case 'itv':
          this.sendSms(`ITV ${this.LS} ${this.HardNumber} ${this.Model} ${this.UsageType||'*'} * ${this.ContractID||'*'}`);
        break;
        case 'voip':
          this.sendSms(`VOIP ${this.LS} ${this.HardNumber} ${this.Model} ${this.UsageType||'*'} * ${this.ContractID||'*'}`);
        break;
        default:return;
      };
    },
    delete_eq(){
      if(!this.LS){return};
      switch(this.service){
        case 'ctv':
          this.sendSms(`HWOFF ${this.LS} CTV ${this.HardNumber?('HardNumber='+this.HardNumber):'*'} ${this.ContractID||'*'}`);
        break;
        case 'spd':
          this.sendSms(`HWOFF ${this.LS} SPD ${this.HardNumber?('HardNumber='+this.HardNumber):'*'} ${this.ContractID||'*'}`);
        break;
        case 'itv':
          this.sendSms(`HWOFF ${this.LS} ITV ${this.HardNumber?('HardNumber='+this.HardNumber):'*'} ${this.ContractID||'*'}`);
        break;
        case 'voip':
          this.sendSms(`HWOFF ${this.LS} VOIP ${this.HardNumber?('HardNumber='+this.HardNumber):'*'} ${this.ContractID||'*'}`);
        break;
        default:return;
      };
    },
    selectService(event){
      let tab=this.tabsServices.find(tab=>tab.name===event.target.value);
      if(!tab){return};
      this.service=tab.name;
      tab.selected=true;
      this.unselectService(tab.name);
    },
    unselectService(selected){
      for(let tab of this.tabsServices){
        if(tab.name!==selected){
          tab.selected=false;
        };
      };
    },
    selectAction(event){
      let tab=this.tabsActions.find(tab=>tab.name===event.target.value);
      if(!tab){return};
      this.action=tab.name;
      tab.selected=true;
      this.unselectAction(tab.name);
    },
    unselectAction(selected){
      for(let tab of this.tabsActions){
        if(tab.name!==selected){
          tab.selected=false;
        };
      };
    },
  },
});
Vue.component("IframeHistory",{
  template:`<div IframeHistory><slot></slot></div>`,
});
Vue.component("IframePing54",{
  template:`<iframe IframePing54 src="https://ping54.ru"/>`,
});
Vue.component("IframeWfm",{
  template:`<iframe IframeWfm src="https://wfmmobile.mts.ru/"/>`,
});
Vue.component("IframeInetcore",{
  template:`<iframe IframeInetcore src="https://fx.mts.ru/"/>`,
});

Vue.component('UISelect', {
  template:`<section name="UISelect" :class="elClass" :style="{'background-color':disabled?'#f1f1f1':''}">
      <label tabindex="1" class="select-el__label" @click="changeOpen">
        <div class="select-el__clear" v-if="clearable&&value" @click.stop="clear">
          <span class="font-size-24px">✖</span>
        </div>
        <div class="select-el__input">
          <slot name="currentValue" :currentValue="currentValue" :itemKey="itemKey" :inputByKey="inputByKey" :open="open">
            <span class="select-el__input-text">
              <template v-if="itemKey">
                <template v-if="inputByKey">{{currentValue}}</template>
                <template v-else-if="currentValue">{{currentValue[itemKey]}}</template>
              </template>
              <template v-else>
                {{currentValue}}
              </template>
            </span>
          </slot>
        </div>
        <div class="select-el__icon"><span class="font-size-24px">▼</span></div>
      </label>
      <span v-if="value||currentValue" class="select-el__label-text pointer-events-none" :style="{'background-color':disabled?'#f1f1f1':''}">{{label}}</span>
      <span v-else class="select-el__placeholder pointer-events-none">{{label}}</span>
      <div class="select-el__wrapper" @click="close"></div>
      <div class="select-el__list">
        <template v-for="(item,index) in items">
          <slot name="itemRow" :setItem="setItem" :open="open" :itemKey="itemKey" :item="item" :isActiveItem="isActiveItem" :inputByKey="inputByKey" :index="index">
            <div :class="itemClass(item)" @click="setItem(item)">
              <slot name="item" :open="open" :itemKey="itemKey" :item="item" :isActiveItem="isActiveItem" :inputByKey="inputByKey" :index="index">
                <template v-if="itemKey">{{item[itemKey]}}</template>
                <template v-else>{{item}}</template>
              </slot>
              <div class="select-el__item-icon">
                <span v-if="isActiveItem(item)" class="font-size-24px main-lilac">☑</span>
                <span v-else class="font-size-24px tone-650">☐</span>
              </div>
            </div>
          </slot>
        </template>
      </div>
  </section>`,
  props: {
    items: { type: Array, default: () => ([]) },
    value: [String, Number, Array, Object],
    label: { type: String, default: '' },
    itemKey: { type: String, default: '' },
    inputByKey: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  data: () => ({
    open: false,
  }),
  computed: {
    elClass() {
      return {
        'select-el--open': this.open,
        'select-el--error': this.error,
        'select-el--disabled': this.disabled,
      };
    },
    currentValue() {
      const value = this.value;
      const itemKey = this.itemKey;
      if (itemKey) {
        const current_value = this.inputByKey ? value : value?.[itemKey];
        const find = this.items.find((item) => item?.[itemKey] == current_value);
        if (find) {
          return value;
        }
      } else {
        if (this.items.includes(value)) return value;
      }
      return '';
    },
  },
  methods: {
    clear() {
      if (this.disabled) return;
      this.$emit('input', '');
      this.$emit('clear');
    },
    changeOpen() {
      if (this.disabled) return;
      this.open = !this.open;
    },
    close() {
      if (this.disabled) return;
      this.open = false;
    },
    isActiveItem(item) {
      if (this.disabled) return;
      const itemKey = this.itemKey;
      const inputByKey = this.inputByKey;
      const value = this.value;
      if (itemKey) {
        if (inputByKey) {
          return value == item?.[itemKey];
        } else {
          return value?.[itemKey] == item?.[itemKey];
        }
      }
      return value == item;
    },
    setItem(item) {
      if (this.disabled) return;
      const itemKey = this.itemKey;
      if (itemKey && this.inputByKey) {
        this.$emit('input', item?.[itemKey]);
      } else {
        this.$emit('input', item);
      }

      this.close();
    },
    itemClass(item) {
      const isActive = this.isActiveItem(item);
      return {
        'select-el__item': true,
        'select-el__item--active': isActive,
      }
    }
  },
});
function randcode(n=1,s='0123456789QAZWSXEDCRFVTGBYHNUJMIKOLPqazwsxedcrfvtgbyhnujmikolp'){let str='';while(str.length<n){str+=s[Math.random()*s.length|0]};return str;};
Vue.component('UIInput', {
  template:`<section name="UIInput" :class="sectionClass">
    <label class="input-el__label">
      <slot v-if="focus||value" name="prefix"></slot>
      <div class="input-el__input-wrapper">
        <datalist :id="datalistId">
          <template v-for="(item,key) of items">
            <template v-if="Array.isArray(item)">
              <option :key="key" :label="item[0]" :value="item[1]"></option>
            </template>
            <template v-else-if="item?.label||item?.value">
              <option :key="key" :label="item.label" :value="item.value"></option>
            </template>
            <template v-else>
              <option :key="key">{{item}}</option>
            </template>
          </template>
        </datalist>
        <input class="input-el__input" :class="inputClass" v-bind="{value,disabled,type,placeholder:focus?placeholder:label,list:datalistId,...$attrs}" v-filter="filter" :style="{'background-color':disabled?'#f1f1f1':''}" @focus="focus=true" @blur="focus=false" @input="$emit('input',$event.target.value)"  @keyup.enter="$emit('onKeyUpEnter')">
      </div>
      <span v-show="focus||value" class="input-el__label-text" :style="{'background-color':disabled?'#f1f1f1':''}">{{label}}</span>
      <slot name="postfix"></slot>
      <div class="input-el__clear" v-show="clearable&&value" @click.stop="clear">
        <span class="font-size-24px">✖</span>
      </div>
      <slot name="postfix2"></slot>
    </label>
  </section>`,
  props: {
    value: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    type: { type: String },
    error: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
    items:{type:Array,default:()=>[]},
    datalistId:{type:String,default:randcode(20)},
    filter: { type: String, default: '' },
  },
  data: () => ({
    focus: false,
  }),
  computed: {
    sectionClass() {
      return {
        'input-el--focus': this.focus,
        'input-el--filled': this.value,
        'input-el--error': this.error,
        'input-el--disabled': this.disabled,
      };
    },
    inputClass() {
      return {
        'input-el__input--prefix': !!this.$slots.prefix,
        'input-el__input--postfix': !!this.$slots.postfix,
      };
    },
  },
  methods: {
    clear() {
      if (this.disabled) return;
      this.$emit('input', '');
    },
  },
});
Vue.component('UIInputError',{
  template:`<div v-if="text" name="UIInputError" class="font--11-600">{{text}}</div>`,
  props:{
    text:{type:[String,Number],default:''},
  },
});

const app=new Vue({
  el:'#app',
  template:`<div app>
    <HeaderTabs @on-select="(name)=>{mode=name}"/>
    <TabSection v-show="mode==='tasks'"><IframeWfm/></TabSection>
    <TabSection v-show="mode==='inetcore'"><IframeInetcore/></TabSection>
    <TabSection v-show="mode==='actions'"><ActionsContent/></TabSection>
    <TabSection v-show="mode==='actions2'"><Actions2Content/></TabSection>
    <TabSection v-show="mode==='history'"><IframeHistory/></TabSection>
    <TabSection v-show="mode==='ping54'"><IframePing54/></TabSection>
  </div>`,
  components:{},
  data:()=>({
    mode:'actions',
  }),
  created(){},
  watch:{
    'mode'(name){console.log('mode:',this.mode)},
  },
  computed:{},
  methods:{},
});
