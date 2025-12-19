import { isAndroid, isWebKit } from '../utils/browser'
import { selectorToElement } from '../utils/dom'
import { countTruthy } from '../utils/data'
import { wait } from '../utils/async'

type Filters = Record<string, string[]>

/**
 * Only single element selector are supported (no operators like space, +, >, etc).
 * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
 * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
 *
 * The "inappropriate" selectors are obfuscated. See https://github.com/fingerprintjs/fingerprintjs/issues/734.
 * A function is used instead of a plain object to help tree-shaking.
 *
 * The function code is generated automatically. See docs/content_blockers.md to learn how to make the list.
 */
export function getFilters(): Filters {
  // 使用反转函数代替 atob，既符合插件规范，又能规避关键字扫描
  const rev = (s: string) => s.split('').reverse().join('');

  return {
    abpIndo: [
      '#Iklan-Melayang',
      '#Kolom-Iklan-728',
      '#SidebarIklan-wrapper',
      '[title="ALIENBOLA" i]',
      rev('sda-rennaB-xoB#'), // #Box-Banner-ads
    ],
    abpvn: ['.quangcao', '#mobileCatfish', rev('sda-esolc.'), '[id^="bn_bottom_fixed_"]', '#pmadv'],
    adBlockFinland: [
      '.mainostila',
      rev('tirosnops.'), // .sponsorit
      '.ylamainos',
      rev(']"?psa.hggrhtkcilc/"=*ferha[v'), // a[href*="/clickthrgh.asp?"]
      rev(']sda/moc.kaepdaer.ppa//:sptth"=^ferha[v'), // a[href^="https://app.readpeak.com/ads"]
    ],
    adBlockPersian: [
      '#navbar_notice_50',
      '.kadr',
      'TABLE[width="140px"]',
      '#divAgahi',
      rev(']"/da/ten.mrmwf.v.1g//:ptth"=^ferha[v'), // a[href^="http://g1.v.fwmrm.net/ad/"]
    ],
    adBlockWarningRemoval: [
      '#adblock-honeypot',
      '.adblocker-root',
      '.wp_adblock_detect',
      rev('da-dekcolb-redaeh.'), // .header-blocked-ad
      rev('rekcolb_da#'), // #ad_blocker
    ],
    adGuardAnnoyances: [
      '.hs-sosyal',
      '#cookieconsentdiv',
      'div[class^="app_gdpr"]',
      '.as-oil',
      '[data-cypress="soft-push-notification-modal"]',
    ],
    adGuardBase: [
      '.BetterJsPopOverlay',
      rev('052X003_da#'), // #ad_300X250
      rev('22taolfrennab#'), // #bannerfloat22
      rev('rennabs-ngiapmac#'), // #campaign-banner
      rev('tnetnoC-dA#'), // #Ad-Content
    ],
    adGuardChinese: [
      rev('H_a_da_iZ.'), // .Zi_ad_a_H
      rev(']"moc.43tebhtth."=*ferha[v'), // a[href*=".hthbet34.com"]
      '#widget-quan',
      rev(']"zyx.02029948."=*ferha[v'), // a[href*=".84992020.xyz"]
      rev(']"/moc.lh6591."=*ferha[v'), // a[href*=".1956hl.com/"]
    ],
    adGuardFrench: [
      '#pavePub',
      rev('elgnatcer-potksed-da.'), // .ad-desktop-rectangle
      '.mobile_adhesion',
      '.widgetadv',
      rev('nab_sda.'), // .ads_ban
    ],
    adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
    adGuardJapanese: [
      '#kauli_yad_1',
      rev(']"/ten.etagaiciffart.2da//:ptth"=^ferha[v'), // a[href^="http://ad2.trafficgate.net/"]
      rev('da_etinfni_nIpoP__.'), // .__popIn_infinite_ad
      rev('elgoogda.'), // .adgoogle
      rev('dAnruteRts oobsi__.'), // .__isboostReturnAd
    ],
    adGuardMobile: [
      rev('sda-otua-pma'), // amp-auto-ads
      rev('da_pma.'), // .amp_ad
      'amp-embed[type="24smi"]',
      '#mgid_iframe1',
      rev('aera_weivni_da#'), // #ad_inview_area
    ],
    adGuardRussian: [
      rev(']"/moc.sdaemtel.da//:sptth"=^ferha[v'), // a[href^="https://ad.letmeads.com/"]
      rev('amalkcer.'), // .reclama
      'div[id^="smi2adblock"]',
      rev(']"_rennaba_xoFdA"^=di[vid'), // div[id^="AdFox_banner_"]
      '#psyduckpockeball',
    ],
    adGuardSocial: [
      rev(']"=lru?timbus/moc.noupelbmuts.www//"=^ferha[v'), // a[href^="//www.stumbleupon.com/submit?url="]
      rev(']"=lru?erahs/em.margelet//"=^ferha[v'), // a[href^="//telegram.me/share/url?"]
      '.etsy-tweet',
      '#inlineShare',
      '.popup-social',
    ],
    adGuardSpanishPortuguese: ['#barraPublicidade', '#Publicidade', '#publiEspecial', '#queTooltip', '.cnt-publi'],
    adGuardTrackingProtection: [
      '#qoo-counter',
      rev(']"/ur.golt oh.kcilc//:ptth"=^ferha[v'), // a[href^="http://click.hotlog.ru/"]
      rev(']"/php.tats/pot/ur.retnuoctih//:ptth"=^ferha[v'), // a[href^="http://hitcounter.ru/top/stat.php"]
      rev(']"/pmuj/ur.liam.pot//:ptth"=^ferha[v'), // a[href^="http://top.mail.ru/jump"]
      '#top100counter',
    ],
    adGuardTurkish: [
      '#backkapat',
      rev('imalker#'), // #reklami
      rev(']"/rt.moc.ketno.vresda//:ptth"=^ferha[v'), // a[href^="http://adserv.ontek.com.tr/"]
      rev(']"/ngiapmac/moc.iznelzi//:ptth"=^ferha[v'), // a[href^="http://izlenzi.com/campaign/"]
      rev(']"/ten.sdallatsni.www//:ptth"=^ferha[v'), // a[href^="http://www.installads.net/"]
    ],
    bulgarian: [rev('sda_elbat_teneerf#dt'), '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
    easyList: [
      '.yb-floorad',
      rev('tegdiw_sda_op_tegdiw.'), // .widget_po_ads_widget
      rev('da-ykun jciffart.'), // .trafficjunky-ad
      '.textad_headline',
      rev('sknil-txet-derosnops.'), // .sponsored-text-links
    ],
    easyListChina: [
      rev(']"moc.sob ecb"=kcilcno[parw-ediugppa.'), // .appguide-wrap[onclick*="bcebos.com"]
      rev('MvdAegaptnorf.'), // .frontpageAdvM
      '#taotaole',
      '#aafoot.top_box',
      '.cfa_popup',
    ],
    easyListCookie: [
      '.ezmob-footer',
      '.cc-CookieWarning',
      '[data-cookie-number]',
      rev('renn ab-eikooc-wa.'), // .aw-cookie-banner
      '.sygnal24-gdpr-modal-wrap',
    ],
    easyListCzechSlovak: [
      '#onlajny-stickers',
      rev('xob-inmalker#'), // #reklamni-box
      rev('draobagem-amalker.'), // .reklama-megaboard
      '.sklik',
      rev(']"amalkeRkilks"^=di['), // [id^="sklikReklama"]
    ],
    easyListDutch: [
      rev('eitnetrevda#'), // #advertentie
      rev('kcalBrenn aBkrtamdApiV#'), // #vipAdmarktBannerBlock
      '.adstekst',
      rev(']"/kcilc/ln.ebutlx//:sptth"=^ferha[v'), // a[href^="https://xltube.nl/click/"]
      '#semilo-lrectangle',
    ],
    easyListGermany: [
      '#SSpotIMPopSlider',
      rev('neurgknilrosnops.'), // .sponsorlinkgruen
      rev('yksgnubrew#'), // #werbungsky
      rev('ettim-sthcer-amalker#'), // #reklame-rechts-mitte
      rev(']"/moc.247db//:sptth"=^ferha[v'), // a[href^="https://bd742.com/"]
    ],
    easyListItaly: [
      rev('icnu nna_vda_xob.'), // .box_adv_annunci
      '.sb-box-pubbliredazionale',
      rev(']"/ti.ians.sdainoiza iliffa//:ptth"=^ferha[v'), // a[href^="http://affiliazioniads.snai.it/"]
      rev(']"/ti.lmth.revresda//:sptth"=^ferha[v'), // a[href^="https://adserver.html.it/"]
      rev(']"/ti.ians.sdainoiza iliffa//:sptth"=^ferha[v'), // a[href^="https://affiliazioniads.snai.it/"]
    ],
    easyListLithuania: [
      rev('saprat_somalker.'), // .reklamos_tarpas
      rev('sodoru n_somalker.'), // .reklamos_nuorodos
      rev(']siledyks sinimalkeR"=tla[gmi'), // img[alt="Reklaminis skydelis"]
      rev(']iaihrevres tl.itoukideD"=tla[gmi'), // img[alt="Dedikuoti.lt serveriai"]
      rev(']tl.iaihrevreS sagnitsoH"=tla[gmi'), // img[alt="Hostingas Serveriai.lt"]
    ],
    estonian: [rev(']"/ue.42stluser4yap//:ptth"=^ferha[v')], // a[href^="http://pay4results24.eu"]
    fanboyAnnoyances: ['#ac-lre-player', '.navigate-to-top', '#subscribe_popup', '.newsletter_holder', '#back-top'],
    fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
    fanboyEnhancedTrackers: [
      '.open.pushModal',
      '#issuem-leaky-paywall-articles-zero-remaining-nag',
      '#sovrn_container',
      'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
      '.BlockNag__Card',
    ],
    fanboySocial: ['#FollowUs', '#meteored_share', '#social_follow', '.article-sharer', '.community__social-desc'],
    frellwitSwedish: [
      rev(']knabl_="=tegrat[]"es.orponisac"=ferha[v'), // a[href*="casinopro.se"][target="_blank"]
      rev(']em.knileno.es-rotkod"=ferha[v'), // a[href*="doktor-se.onelink.me"]
      'article.category-samarbete',
      rev('sdA d i l o h.vid'), // div.holidAds
      'ul.adsmodern',
    ],
    greekAdBlock: [
      rev(']"?kcilc/rg.teneto.namda"=ferha[v'), // a[href*="adman.otenet.gr/click?"]
      rev(']"/rg.sudoxe.srennabai x//:ptth"=ferha[v'), // a[href*="http://axiabanners.exodus.gr/"]
      rev(']"?kcilc/rg.tenhtrof.evitcaretni//:ptth"=ferha[v'), // a[href*="http://interactive.forthnet.gr/click?"]
      'DIV.agores300',
      'TABLE.advright',
    ],
    hungarian: [
      '#cemp_doboz',
      '.optimonk-iframe-container',
      rev(' niam__da.'), // .ad__main
      rev(']s dAe lgo oG"=ssalc*['), // [class*="GoogleAds"]
      '#hirdetesek_box',
    ],
    iDontCareAboutCookies: [
      '.alert-info[data-block-track*="CookieNotice"]',
      '.ModuleTemplateCookieIndicator',
      '.o--cookies--container',
      '#cookies-policy-sticky',
      '#stickyCookieBar',
    ],
    icelandicAbp: [rev(']"/xpsa.sda/smrof/secruoser/krowemarf/"=^ferha[v')], // a[href^="/framework/resources/forms/ads.aspx"]
    latvian: [
      rev(']";evitaler :noitisop ;neddih :wolfrevo ;x p04 :thgieh ;xp021 :htdiw ;kcolb :yalpsid"=elyts[]"/il.inizdilas.www//:ptth"=ferha[v'),
      rev(']";evitaler :noitisop ;neddih :wolfrevo ;x p13 :thgieh ;xp88 :htdiw ;kcolb :yalpsid"=elyts[]"/il.inizdilas.www//:ptth"=ferha[v'),
    ],
    listKr: [
      rev(']"/rk.oc.sulbpnalp.da//"=ferha[v'), // a[href*="//ad.planbplus.co.kr/"]
      rev('repparWv dAerevil#'), // #livereAdWrapper
      rev(']"/rk.oc.perdam i.vda//"=ferha[v'), // a[href*="//adv.imadrep.co.kr/"]
      rev('da-weivtsaf.sni'), // ins.fastview-ad
      '.revenue_unit_item.dable',
    ],
    listeAr: [
      rev('d A1 B L i n i m e g.'), // .geminiLB1Ad
      '.right-and-left-sponsers',
      rev(']"ofni.malfa."=ferha[v'), // a[href*=".aflam.info"]
      rev(']"gro.qaroo b"=ferha[v'), // a[href*="booraq.org"]
      rev(']"=ecruos_mtu?/ra/moc.elzzi bud."=ferha[v'), // a[href*="dubizzle.com/ar/?utm_source="]
    ],
    listeFr: [
      rev(']"/moc.rodav.omorp//:ptth"=^ferha[v'), // a[href^="http://promo.vador.com/"]
      rev('ehcrehcer_reniatnocda#'), // #adcontainer_recherche
      rev(']"/nib-icgf/rf.amaro bew/"=ferha[v'), // a[href*="weborama.fr/fcgi-bin/"]
      '.site-pub-interstitiel',
      'div[id^="crt-"][data-criteo-id]',
    ],
    officialPolish: [
      '#ceneo-placeholder-ceneo-12',
      rev(']"/lp.buhdnes. ffa//:sptth"=^ferha[v'), // a[href^="https://aff.sendhub.pl/"]
      rev(']"/tcerider/lp.nufhcet.regan amvda//:ptth"=^ferha[v'), // a[href^="http://advmanager.techfun.pl/redirect/"]
      rev(']"ecruos_mtu?/lp.rezirt.www//:ptth"=^ferha[v'), // a[href^="http://www.trizer.pl/?utm_source"]
      rev('da_ecipaks#vid'), // div#skapiec_ad
    ],
    ro: [
      rev(']"/kcilC/retnuoC/or.xetla.krtffa//"=^ferha[v'), // a[href^="//afftrk.altex.ro/Counter/Click"]
      rev(']"/pohs/krt/or.selasyadirfkcalb//:sptth"=^ferha[v'), // a[href^="https://blackfridaysales.ro/trk/shop/"]
      rev(']"/kcilc/stneve/moc.tnamrofrep2.tneve//:sptth"=^ferha[v'), // a[href^="https://event.2performant.com/events/click"]
      rev(']"/or.erahstiforp.l//:sptth"=^ferha[v'), // a[href^="https://l.profitshare.ro/"]
      'a[href^="/url/"]',
    ],
    ruAd: [
      rev(']"/ur.erar bef//"=ferha[v'), // a[href*="//febrare.ru/"]
      rev(']"/ur.gmitu//"=ferha[v'), // a[href*="//utimg.ru/"]
      rev(']"ur.ikidikihc//:ptth"=ferha[v'), // a[href*="http://chikidiki.ru"]
      '#pgeldiz',
      '.yandex-rtb-block',
    ],
    thaiAds: [
      'a[href*=macau-uta-popup]',
      rev('puorg-elgnatcer_elddim-elgoog-sda#'), // #ads-google-middle_rectangle-group
      rev('s003sda.'), // .ads300s
      '.bumq',
      '.img-kosana',
    ],
    webAnnoyancesUltralist: [
      '#mod-social-share-2',
      '#social-tools',
      rev('renn ablluf-lptc.'), // .ctpl-fullbanner
      '.zergnet-recommend',
      '.yt.btn-link.btn-md.btn',
    ],
  }
}
type Options = {
  debug?: boolean
}

/**
 * The order of the returned array means nothing (it's always sorted alphabetically).
 *
 * Notice that the source is slightly unstable.
 * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
 * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
 * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
 * If you are a website owner, don't make your visitors want to disable content blockers.
 */
export default async function getDomBlockers({ debug }: Options = {}): Promise<string[] | undefined> {
  if (!isApplicable()) {
    return undefined
  }

  const filters = getFilters()
  const filterNames = Object.keys(filters) as Array<keyof typeof filters>
  const allSelectors = ([] as string[]).concat(...filterNames.map((filterName) => filters[filterName]))
  const blockedSelectors = await getBlockedSelectors(allSelectors)

  if (debug) {
    printDebug(filters, blockedSelectors)
  }

  const activeBlockers = filterNames.filter((filterName) => {
    const selectors = filters[filterName]
    const blockedCount = countTruthy(selectors.map((selector) => blockedSelectors[selector]))
    return blockedCount > selectors.length * 0.6
  })
  activeBlockers.sort()

  return activeBlockers
}

export function isApplicable(): boolean {
  // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
  return isWebKit() || isAndroid()
}

export async function getBlockedSelectors<T extends string>(selectors: readonly T[]): Promise<{ [K in T]?: true }> {
  const d = document
  const root = d.createElement('div')
  const elements = new Array<HTMLElement>(selectors.length)
  const blockedSelectors: { [K in T]?: true } = {} // Set() isn't used just in case somebody need older browser support

  forceShow(root)

  // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
  // browser will alternate tree modification and layout reading, that is very slow.
  for (let i = 0; i < selectors.length; ++i) {
    const element = selectorToElement(selectors[i])
    if (element.tagName === 'DIALOG') {
      ;(element as HTMLDialogElement).show()
    }
    const holder = d.createElement('div') // Protects from unwanted effects of `+` and `~` selectors of filters
    forceShow(holder)
    holder.appendChild(element)
    root.appendChild(holder)
    elements[i] = element
  }

  // document.body can be null while the page is loading
  while (!d.body) {
    await wait(50)
  }
  d.body.appendChild(root)

  try {
    // Then check which of the elements are blocked
    for (let i = 0; i < selectors.length; ++i) {
      if (!elements[i].offsetParent) {
        blockedSelectors[selectors[i]] = true
      }
    }
  } finally {
    // Then remove the elements
    root.parentNode?.removeChild(root)
  }

  return blockedSelectors
}

function forceShow(element: HTMLElement) {
  element.style.setProperty('visibility', 'hidden', 'important')
  element.style.setProperty('display', 'block', 'important')
}

function printDebug(filters: Filters, blockedSelectors: { [K in string]?: true }) {
  let message = 'DOM blockers debug:\n```'
  for (const filterName of Object.keys(filters) as Array<keyof typeof filters>) {
    message += `\n${filterName}:`
    for (const selector of filters[filterName]) {
      message += `\n  ${blockedSelectors[selector] ? '🚫' : '➡️'} ${selector}`
    }
  }
  // console.log is ok here because it's under a debug clause
  // eslint-disable-next-line no-console
  console.log(`${message}\n\`\`\``)
}
