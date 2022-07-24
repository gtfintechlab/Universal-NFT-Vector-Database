<template>
  <aside>
    <div class="content-container">
      <h1 class="sidebar-header">
        Universal NFT Vector Database
      </h1>
      <div>
        <div v-for="(section, index) in Object.keys(config)" :key="index">
          <h3>{{ section }}</h3>
          <div class="section-container">
            <div v-for="(page, index2) in Object.keys(config[section])" :key="index2">
              <NuxtLink class="tab-container" 
                        :to="config[section][page]['link']"
                        @mouseleave="setHover('','')" 
                        @mouseenter="setHover(index, index2)">
                
                <Icon width="30px" 
                      :icon="config[section][page]['icon']" 
                      :class="{'tab-hover': checkHover(index, index2),
                               'tab-selected': checkRoute(config[section][page]['link'])
                              }
                      "
                      />
                <span
                      @mouseenter="setHover(index, index2)"
                      @mouseleave="setHover('','')"
                      :class="{ 'tab-subheader': true, 
                                'tab-hover': checkHover(index, index2),
                                'tab-selected': checkRoute(config[section][page]['link']) 
                              }" >{{ page }}
                      </span>
              </NuxtLink>
            </div>
          </div>
          <hr v-if="index !== (Object.keys(config).length - 1)" class="section-divider">
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { Icon } from '@iconify/vue'
import { sidebarConfig } from '../utils/Config'

export default {
  name: 'SideBar',
  components: { Icon },
  props: {
    config: {
      type: null,
      default: sidebarConfig,
      required: false
    }
  },
  data () {
    return {
      hovering: -1,
      backgroundStyle:{
        backgroundColor:"#16a085" 
      }
    }
  },

  methods: {
    setHover(index, index2){
      this.hovering = (index + ' ' + index2)
    },

    checkHover(index, index2){
      return this.hovering === (index + ' ' + index2)
    },

    checkRoute(bindedRoute){
      return ('/'+ this.$route.name).toLowerCase() === bindedRoute.toLowerCase()
    }
  }
}
</script>

<style lang="scss" scoped>

.content-container{
  margin-left: 5px;
}
aside{
  position: fixed;
  float: left;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: #16324C;
  width: 260px;
  overflow: hidden;
  min-height: calc(100vh);
  padding: 1rem;

}
.sidebar-header{
    margin-top: 2rem;
    margin-bottom: 2rem;
    font-family: 'Outfit';
    color: white;
    font-size: 1.3rem;
    text-align: center;
  }

  .section-divider{
    width: 90%;
    color: white;
    background-color: white;
    height: 2px;
    border: 0 none;
    margin-top: 20px;
  }
  .section-container{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .tab-container{
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    column-gap: 25px;
    margin-left: 10px;
    color: #FFFFFF;
    text-decoration: none;

  }

  .tab-subheader{
    font-size: 20px;
    font-family: 'Outfit';
  }

  .tab-hover{
    color: #d4d4fe !important;
  }

  .tab-selected{
    color: #28b0ff !important;
  }

  h3{
    color: #A5DEFF;
    font-family: 'Outfit';
  }

</style>
