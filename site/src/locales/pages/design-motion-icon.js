export default {
  'en-US': {
    motion: {
      summary: {
        title: 'Summary',
        text: 'Static elements convey information, while motion graphics enhance the conveyance and perception of information above them, endowing them with additional functions. Although motion graphics are often overlooked in backend systems, good motion graphics can help users understand the interface, clarify logic, and improve efficiency. The construction of the TDesign motion graphics system reflects the values of inclusivity, diversity, evolution, and connectivity, meeting the high-efficiency usage demands of backend scenarios. Based on different elements, devices, and types of motion, a dynamic adaptable motion system has been developed that allows users to perceive a unified brand experience under different conditions.',
      },
      principle: {
        title: 'Principle',
        intro:
          'The construction of the TDesign animation system continues the values of inclusiveness, diversity, evolution, and connectivity of TDesign, and extends them into three animation principles: 「understanding, focusing, empathy」.',
        understandingTitle: 'Understanding',
        understanding:
          'The first principle of animation is to assist users in understanding the content and completing operations. Abrupt flashes always leave people confused, so adding lifelike movements to elements in the interface can help avoid a sense of unnatural motion. By guiding the visual focus of users through motion trajectory, the animation can provide smooth and seamless transitions for otherwise static elements.',
        focusingTitle: 'Focusing',
        focusing:
          "Dynamic content is always more attention-grabbing than static content. Presenting important information in a dynamic way can not only naturally express the beginning and end trajectory of elements but also guide users' focus.",
        empathyTitle: 'Empathy',
        empathy:
          "Dynamic presentation is more in line with human perception of life. The animation can smoothly convey a narrative that connects static elements and even express emotions in the interface. Whether it's a jumping notification or an elegant dropdown, elements can establish empathy with users, bridging the gap and achieving a more immersive, natural, and consistent understanding of the virtual world.",
        goal: 'The ultimate goal of this is to return to the original design concept of "enhancing perception" and the design of propulsion beyond static elements.',
        measureTitle: 'Measuring the significance of motion effects',
        measure:
          'Adding motion effects to the middle-end and back-end systems is not a must. Appropriate motion effects can enhance user perception, while excessive motion effects can cause burden and interference. We have established a {link} for self-check, enabling the interface to check whether the motion effects are reasonable and meet the rendering performance when adding motion effects.',
        selfCheckLink: 'Motion Self-check Form',
      },
      mode: {
        title: 'Motion Mode',
        intro:
          'The motion modes of TDesign classify all moving elements into two types: micro and macro. Micro motion effects of elements and the macro motion of components are combined from point to surface to form a world of motion.',
        definitionTitle: 'Definition',
        micro:
          'Micro content is often tiny interactions between components or elements themselves, generally icon or component internal motion effects, such as warning, like, delete, and other icon motion effects, or component motion effects such as checkbox selection, button click state, input box shaking, etc. They all enhance the expression of meaning through motion.',
        macro:
          'Anything beyond this is classified as macro content. These are the movements at the component level and above. We classify macro-movements into three major motion modes: 「axis movement, container conversion, fade in and out」.',
        chooseTitle: 'How to Choose Motion Mode',
        choose:
          'The selection of motion modes is determined by the spatial relationship of the elements or their connection with other elements.',
        axisItem: 'Axis movement',
        containerItem: 'Container conversion',
        fadeItem: 'Fade-in and fade-out',
        axisTitle: 'Axis Movement',
        axis: 'Axis movement is used to represent the transition of elements with spatial relation and to enhance the directionality and relationship between the start and end points in space. It includes three-axis displacement, scaling, and transparency.',
        axisDetail:
          'The direction of axis movement depends on the spatial relationship between the elements. First, it can be used as the motion of page switching. The X-axis is mostly used for tab switching with horizontal relation, the Y-axis is mostly used for tab switching with vertical relation, and the Z-axis is mostly used for switching with hierarchical relation. Secondly, it can also be used to enhance the implication of the spatial relationship between elements or between elements and the screen. The XY-axis movement is determined specifically based on the association, and the Z-axis movement is mostly used for pop-ups, bubble notifications, dialog boxes, etc.',
        xAxis: 'X-axis',
        yAxis: 'Y-axis',
        zAxis: 'Z-axis',
        containerTitle: 'Container Conversion',
        container:
          'Container conversion is used to represent the transition of shared containers. By smoothly transitioning the shape, it enhances the continuity between elements before and after the transition.',
        containerDetail:
          'The shared containers in container conversion may not be completely similar before and after the transition, and may instead contain sub-elements or related content. In this case, depending on whether the original element has maintained its original shape and position, if it has changed, the new element can be created using the container conversion mode, while if it remains unchanged, please refer to the Axis Motion mode.',
        fadeTitle: 'Fade-in and Fade-out',
        fade: 'Fade-in and fade-out is used to represent the transition of independent elements before and after movement, providing feedback on the continuity of operation and reducing any rigidity in viewing. This distinguishes it from unrelated static elements.',
      },
      duration: {
        title: 'Motion Time',
        token: 'Token',
        intro:
          'To balance the perceptual differences under different viewing distances on different devices, TDesign, based on its inclusive values, recommends distinguishing two sets of durations on desktop and mobile devices to provide a consistent sensory experience.',
        detail:
          'According to the visual range of desktop and mobile devices and keeping a unified perceptual constancy, the animation effect on mobile devices should be shortened compared to that on desktop devices. The closer the viewing distance, the stronger the perception of motion. Based on the duration of the human visual cycle of about 100ms and the characteristics of the mobile screen size, we can start to calculate from 100ms. Taking into account the impact of the viewing distance on desktop devices, the animation duration can be appropriately increased compared to mobile devices, starting from 200ms. Therefore, we can define the relationship between the peak duration on desktop and mobile devices:',
        formula: 'Desktop Client = Mobile Client × 2',
        fixedTitle: 'Fixed Duration',
        fixed:
          'For desktop devices (laptops and desktops), a duration of 200-600ms is suitable for element movement. For mobile devices (mobile phones and tablets), a duration of 100-400ms is a better duration for element movement.',
        research:
          'Research and surveys have shown that an animation duration of 100ms is the beginning of basic cognitive recognition. A duration of less than 100ms is imperceptible to users, while a duration of 1000ms is the limit of user perception. We have divided the duration of motion into several intervals according to the cognitive processing. The intervals are divided in proportion, following the rules of natural movement, to increase the rhythm and resemble rhythm in music.',
        tokenIntro:
          "We have set the basic duration 'token' for different element sizes and suitable motion perceptions.",
        usage: 'Usage',
        value: 'Value',
        mobileBase: 'Micro conversion and fade-in-out',
        mobileModerate: 'Collapse、Popup、Message',
        mobileSlow: 'Select、Dropdown、Drawer、Tabs、Popup',
        desktopBase: 'Micro conversion and fade-in-out',
        desktopModerate: 'Anchor、Tabs、Dropdown、List click、Tree',
        desktopSlow: 'Drawer、Message、Notification',
        dynamicTitle: 'Dynamic Duration',
        dynamic:
          'The dynamic duration value is the most suitable motion perception for an element, and is calculated based on the size of the element and the distance of the motion. Therefore, we have set a duration calculator for element movement for different sizes of elements.',
      },
      easing: {
        title: 'Easing Curve',
        intro:
          'The basic easing functions of TDesign are all <code>Cubic</code>. Only <code>Elastic</code> easing curve is used for non-UI elements such as cartoon illustrations. <code>Linear</code> function is used for fast fading transitions in motion.',
        cssValue: 'CSS Value',
        standardUsage: 'Element moving on the screen',
        outUsage: 'Element entering the screen',
        inUsage: 'Element leaving the screen',
        linearUsage: 'Gradients performed simultaneously with other movements',
        standard: 'standard easing',
        out: 'ease out',
        in: 'ease in',
        linear: 'linear',
      },
      brand: {
        title: 'Integration of Brand Language',
        text: "TDesign incorporates Tencent's forward-looking and futuristic driving features to express a sense of progress and speed in the motion effects. The motion dynamics of easing functions reflect the sense of speed, while the sense of progress is embodied in the brand's distinctive diagonal animation of the number 8. Designers have refined Tencent's characteristic diagonal 8-degree feature and applied it to animated feedback triggered by mouse clicks. Vividly incorporating brand perception without affecting the functionality of mid-to-backstage components, shaping an integrated brand experience.",
        button: 'Main Button',
        placeholder: 'Please select',
        options: {
          architecture: 'Architecture Cloud',
          bigData: 'Big Data',
          blockchain: 'Blockchain',
          iot: 'Internet of Things',
          ai: 'Artificial Intelligence',
          computing: 'Computing Scenarios',
          computingDetail: 'Computing Scenarios (High-performance computing)',
        },
      },
      arrangement: {
        title: 'Motion Arrangement',
        intro:
          'The sequentiality of moving objects implies the organizational relationship between elements. A large number of animations taking place simultaneously can cause interference with information acquisition. Good arrangement can present the motion sequence of elements, expressing the order and logic of the interface.',
        pathTitle: 'Path Order',
        path: 'In container transitions, content is divided into continuity and non-continuity. The motion path of continuous content needs to reflect a smooth visual impression to conform to the characteristic of object motion in the natural world that needs to overcome gravity.',
        biAxialTitle: 'XY Bi-Axial Motion',
        biAxial:
          'Bi-Axial Motion Avoid using straight-line motion for bi-axial motion, but use curved motion instead. To overcome gravity, the y-axis change often starts with a gentle angle and ends with a steeper angle.',
        singleTitle: 'XY Single-Axial Motion',
        single: 'For non-cartoon single-axis motion, do not use elastic animation or increase motion axes.',
        combinationTitle: 'Bi-Axial Combination Motion',
        combination:
          'When sorting nine-grid elements, the elements move to fill positions along a straight-line path with a hierarchy that satisfies a real sorting order. Do not use motion that exits and re-enters the screen.',
        reduceTitle: 'Reduce Unnecessary Arrangements',
        reduce:
          'During page loading, we provide a Skeleton component to indicate loading. Considering the characteristics of mid-to-backstage scenes, it is not recommended to use sequential animation to indicate the order of content on the first load of the page, but rather directly present the page or use fade-in and fade-out animation to reduce the duration of page loading and the distraction caused by excessive motion.',
      },
      check: {
        title: 'Motion Self-check',
        intro:
          'When adding animations to the interface, please refer to the following table to conduct a self-check on the necessity of the animation, ensuring that the animation is reasonable and necessary, and in line with TDesign values.',
        meaning: 'What is the meaning of my animation for the interface?',
        solve: 'What problem does it solve? Does it meet one or more goals?',
        understand: 'Does my animation help user to understand?',
        entropy: 'Has it not caused an increase in system entropy?',
        perceived: 'Can my animation be clearly perceived?',
        category: 'Is it one of the micro or macro categories?',
        duration: 'Does it meet the basic duration range of each end? Is it perceptible on all ends?',
        allEnds: 'Is it perceptible on all ends?',
        allEndsDesc: '',
        elegant: 'Is animation elegant and simple?',
        curve: 'Has an appropriate easing curve been selected?',
        simple: 'Is animation simple?',
        simpleDesc: '',
        excessive: 'Is my animation excessively arrangement?',
        static: 'Can necessary information still be conveyed statically if the animation is deleted?',
        filename: 'motion-self-check.xls',
        download: 'Download motion self-check form',
      },
    },
    icon: {
      summaryTitle: 'Summary',
      summary:
        'Icons are an important element of UI design, and to some extent, they affect the style of the entire UI interface. In the early stage of TDesign, a set of linear icons is provided for use in middle and back-end scenarios. These icons are designed with a universal standard, which fits the default TDesign style - linear and rounded.',
      principleTitle: 'Principle',
      simplicityTitle: 'Simplicity',
      simplicity:
        'Ensure parameters are simplified during production, avoid decimals and non-integer angles wherever possible. Remove excess anchor points when processing lines and outlines, and avoid unnecessary embellishments when outputting icons to maintain simplicity.',
      accuracyTitle: 'Accuracy',
      accuracy:
        'Avoid using graphics with vague meanings in designs. When representing the same thing with multiple graphics, choose the most common style and adapt as needed. Follow naming conventions when outputting, and use precise descriptions to make it easier for others to find them.',
      moderationTitle: 'Moderation',
      moderation:
        'As a standalone visual entity, individual icons should have a reasonable sense of line density and graphical compatibility. When dealing with necessary high-density icons, rhythm should be considered, and they should be comfortable and non-oppressive. Icon series should follow the principles of moderation, keeping changes within a certain range.',
      specificationTitle: 'Specification',
      gridTitle: 'Grid Specification',
      grid: 'The grid serves as the underlying framework for chart and icon drawing, forming the foundation for all attribute design. Key elements such as the length and weight of lines, and the size and proportion of icons, are all defined based on this structure. Icons are commonly output in four sizes: 16x16px, 20x20px, 24x24px, and 32x32px. These sizes ensure clear display on standard screens. TDesign has ultimately selected the 24x24px size as the unified grid size for icon creation. Icons are designed at this size and then scaled down proportionally to 16x16px after vector outlining for final delivery. This approach aims to maintain compatibility with the default sizing of components from version 1.0, avoiding the need for additional icon size adjustments.',
      pixel:
        "Due to the pixel grid's nature, strokes with non-integer pixel values undergo anti-aliasing, producing semi-transparent gray pixels. This results in blurred edges and compromised visual clarity. Therefore, all strokes must be strictly aligned to the pixel grid during creation to maximize icon sharpness.",
      symmetry:
        'When centering symmetrical graphics, visual balance should not be compromised for strict grid alignment.',
      canvasTitle: 'Canvas and Guidelines',
      canvas:
        'The canvas serves as the practical work area for icon design, controlling composition, limiting size, and adjusting spacing. In TDesign, the active canvas should be confined to the central 20x20px area of the grid. In specific cases, such as elongated icons or those with protruding corners, content extension is permitted to ensure a unified visual weight.',
      guidelines:
        'Auxiliary lines help standardize icon dimensions and dictate the paths of lines. Icons should be drawn according to these guidelines as much as possible to maintain a unified visual weight across the entire set. We have standardized the paths for basic shapes—such as circles, squares, and diagonals—within the grid, forming a comprehensive auxiliary line system. During the design process, the appropriate guidelines should be selected based on the characteristics of the graphic to control its form.',
      guidelineChoice:
        'The choice of auxiliary lines should be guided by the form of the graphic. When necessary, elements may extend beyond these lines; never compromise the design solely to conform to the guidelines.',
      direction:
        'When creating directional icons, it is advisable to extend a minimal visual element (in multiples of 0.25px) in the opposite direction of the pointer to balance the composition.',
      lineTitle: 'Line',
      line: 'To ensure universality, all icons in this system use a 2px stroke width, which is configurable on {link}.',
      iconSite: '🔗 TDesign Icons',
      longLine:
        'When determining the length of long lines, it is recommended to use multiples of 2. This simplifies the process of creating symmetrical layouts.',
      lineEnd:
        'As a general rule, line ends should have square (90-degree) caps. However, when depicting typographic graphics or those with three-dimensional perspective, they should align tangentially to the grid.',
      cornersTitle: 'Corners',
      corners:
        "When treating corners, the rounding should be determined by the graphic's meaning. Appropriate rounding enhances the visual message, rather than defaulting to sharp angles.",
      angleTitle: 'Angle',
      angle:
        'If a line needs to be slanted, it is advisable to align it with the 45° guide or use a multiple of 15° within the grid. This ensures higher line clarity in low-resolution scenarios.',
      negativeAngle: 'Consider not only the angles of the positive shapes but also those of the negative spaces.',
      breaksTitle: 'Breaks',
      breaks:
        'Breaks, often used in composite icons, require case-by-case width analysis to balance visual weight. Max. width: ≤ 2px, in multiples of 0.5px.',
      accessoryTitle: 'Stackable Universal Accessory',
      accessory:
        'To accommodate diverse main graphics under unified standards, medium and small universal accessories are provided.',
      accessoryUse:
        'When using, it is necessary to select the appropriate size and determine the placement based on the specific form of the main graphic.',
      complexityTitle: 'Simplicity',
      complexity: 'Seek simplicity in the internal structure and external outline while ensuring high recognition.',
      arcTitle: 'Arc',
      arc: 'Arc line processing prioritizes using full circles where possible.',
      visit: 'Visit TDesign Icons',
    },
  },
  'zh-CN': {
    motion: {
      summary: {
        title: '概述',
        text: '静态元素传递信息，动效则在其之上增强信息的传递与感知，赋予更多的功能。动效在中后台系统中往往被忽视，但好的动效可以帮助用户理解界面、明确逻辑、提升效率。TDesign 动效系统的搭建延续了 TDesign 包容、多元、进化、连接的价值观，在满足中后台场景高效的使用需求下，根据不同元素、不同设备、不同类型的运动制定了动态适应的运动系统，用户可在不同条件下感知统一的品牌体验。',
      },
      principle: {
        title: '原则',
        intro:
          'TDesign 动效系统的搭建延续了 TDesign 包容、多元、进化、连接的价值观，并将其延展为动效三个原则「理解、聚焦、共情」。',
        understandingTitle: '理解',
        understanding:
          '动效第一原则是辅助用户理解内容，完成操作。生硬的闪现总是让人不明所以，元素将带有生命性的动作融入界面，不会产生反人类感知运动。运动的动线引导用户视觉焦点的转移，为原本生硬的元素转场补间。',
        focusingTitle: '聚焦',
        focusing:
          '动态内容总是更容易比静态内容吸引用户注意力，将重点信息动态化呈现，既可以自然地表现元素运动始末轨迹，又可以引导用户注意焦点。',
        empathyTitle: '共情',
        empathy:
          '动态的演绎更贴合人类对生命的感知，动效将静态元素连贯叙事演绎，还可以在界面上表达出情绪，不论是跳动的通知还是优雅的下拉，元素都可以与用户产生共情，拉近人与操作界面的距离，更有代入感，符合自然世界认知一致性。',
        goal: '这一切的目标回归到「增强感知」的设计原点。在静态元素之外的助推手。',
        measureTitle: '衡量动效意义',
        measure:
          '中后台系统动效的添加不是全加，感知不是须知。适量的动效可以增强用户感知，过量的动效造成负担和干扰。我们建立了{link}方便自查，在为界面添加动效时可供检查是否合理并符合渲染性能。',
        selfCheckLink: '动效自查表',
      },
      mode: {
        title: '运动模式',
        intro:
          'TDesign 动效的运动模式将一切会动的元素划分为微观与宏观两种。元素的微动效和组件宏观的运动由点及面地组成一个运动的世界。',
        definitionTitle: '定义',
        micro:
          '微观内容往往是组件或元素本身微小交互，一般是 icon 或组件内部的动效，如警告、点赞、删除等 icon 动效，或是 Checkbox 勾选、按钮点击状态、输入框抖动等组件动效，他们都是通过运动加强含义的表达。',
        macro:
          '在此之外都属于宏观内容。它是组件层面及以上的运动。我们将宏观运动归类为三大运动模式：「轴运动、容器转换、淡入淡出」。',
        chooseTitle: '如何选定运动模式',
        choose: '运动模式的选择由元素的空间关系或与其他元素的联系性决定。',
        axisItem: '轴运动（当有空间关系触发时）',
        containerItem: '容器转换（有共享内容时）',
        fadeItem: '淡入淡出（前后无逻辑递进性，关联性不大）',
        axisTitle: '轴运动',
        axis: '轴运动用来表现具有空间关系元素的过渡，用来增强元素在空间上的指向性以及起终点关联性。包含三个轴向上的位移、缩放、透明度。',
        axisDetail:
          '轴运动的方向取决于元素与元素间的空间关系。首先可以作为页面类切换的运动，X 轴多用于具有横向关系的 Tab 切换，Y 轴多用于具有纵向关系的 Tab 切换，Z 轴多用于具有上下层级关系的切换；其次还可用于增强元素与元素或元素与屏幕空间关系的暗示，XY 轴向运动具体根据关联性决定，Z 轴运动多用于弹窗、气泡通知、对话框等。',
        xAxis: 'X轴',
        yAxis: 'Y轴',
        zAxis: 'Z轴',
        containerTitle: '容器转换',
        container: '容器转换用来表现具有共用容器时的过渡，通过顺滑衔接的形变来增强元素过渡前后的关联性。',
        containerDetail:
          '容器转换的共用容器不一定过渡前后是完全形似的，可能出现过渡后为其子级或关系递进的内容，此时视原元素形变是否保持原状及位置关联，若演变为新元素使用容器转换模式，若保持原状原位请参考轴运动模式。',
        fadeTitle: '淡入淡出',
        fade: '淡入淡出用来表现元素运动前后缺乏空间、容器关系时作为个体的过渡，通过渐变来提供操作后的关联性反馈，减少观看的生硬感，与无关联性的静态元素作区分。',
      },
      duration: {
        title: '运动时长',
        token: 'Token',
        intro:
          '为了平衡不同设备观看距离下的感知差异，TDesign 出于包容的价值观，建议在台式设备和移动设备上区分两套时长以提供一致的感官体验。',
        detail:
          '根据桌面端和移动端的目视范围，保持统一的知觉恒常性，移动端对比桌面端动画效果需要缩短时效性，目视距离越近则运动感知越强。视力持续时间约为100ms，结合移动端的屏幕尺寸大小特性，从100ms开始计算。桌面端结合目视距离影响，对比移动端接近1倍数的差值，可适当增加动画时长效果，从200ms开始计算。由此可以定义桌面端的峰值时长与移动端峰值时长关系：',
        formula: '桌面端（Laptop和Desktop）= 移动端（Mobile和Pad）× 2',
        fixedTitle: '固定时值',
        fixed:
          '针对桌面端（Laptop 和 Desktop）200～600ms 是合适的元素运动时长；针对移动端（Mobile 和 Pad）100～400ms 是合适的元素运动时长。',
        research:
          '研究和调研表明，100ms的动画时长是基础认知的开始，低于100ms用户是无法感知运动实效性的，而1000ms则到达用户感知的极限。我们划定了几类观感的运动时长区间。划分的区间遵循等比例增加的规则，符合自然界运动的规律，增加节奏感，类似音乐的时值。',
        tokenIntro: '对应不同元素尺寸与适合的运动观感，我们设定了最基本的动效时长 token。',
        usage: '用途',
        value: '值',
        mobileBase: '微观变换和淡入淡出变化',
        mobileModerate: '折叠面板、弹出框、消息',
        mobileSlow: '选择器、下拉菜单、抽屉、选项卡、弹出层',
        desktopBase: '微观变换和淡入淡出变化',
        desktopModerate: '锚点、选项卡、下拉菜单、列表点击、树',
        desktopSlow: '抽屉、消息通知、全局提示',
        dynamicTitle: '动态时值',
        dynamic:
          '只有针对元素尺寸及运动距离计算当前元素的时长，才是最适合该元素的运动观感。所以我们为不同尺寸的元素运动都设定了时长计算器。',
      },
      easing: {
        title: '缓动曲线',
        intro:
          'TDesign 的基础缓动函数都为<code>Cubic</code>，仅卡通插图等非UI元素下使用 <code>Elastic</code> 弹性缓动曲线。对于运动中含有的快速 fading 渐变使用 <code>Linear</code> 线性函数。',
        cssValue: 'CSS 值',
        standardUsage: '元素在画面内运动',
        outUsage: '元素入画',
        inUsage: '元素出画',
        linearUsage: '与其他运动同时进行的渐变',
        standard: '标准缓动',
        out: '缓出',
        in: '缓入',
        linear: '线性',
      },
      brand: {
        title: '品牌语言的融入',
        text: 'TDesign 置入腾讯的前瞻与科技感的驱动力特征，将前进感与速度感表达在动效中，缓动函数的运动态势体现了速度感，前进感由品牌特色的斜 8 度动画体现。设计师提炼腾讯品牌的斜 8 度特征，将其运用在鼠标点击触发时的动画反馈，在不影响中后台组件功能性的情况下，生动地带入品牌感知，塑造一体化的品牌体验。',
        button: '主要按钮',
        placeholder: '请选择云解决方案',
        options: {
          architecture: '架构云',
          bigData: '大数据',
          blockchain: '区块链',
          iot: '物联网',
          ai: '人工智能',
          computing: '计算场景',
          computingDetail: '计算场景（高性能计算）',
        },
      },
      arrangement: {
        title: '运动编排',
        intro:
          '运动物体的顺序性暗示了元素之间的组织关系，大量同时进行的动画会对信息获取产生干扰，良好的编排可以将元素的运动时序展现出来，表达界面的秩序与逻辑。',
        pathTitle: '路径秩序化',
        path: '如在容器转换中，内容分为延续性与非延续性。延续性内容的运动路径需要体现平稳的观感，使其符合自然世界物体运动需要克服重力的特征。',
        biAxialTitle: 'XY双轴变化运动',
        biAxial:
          '双轴变化运动请不要使用直线行进，而要使用曲线行进。为了克服重力，y轴变化往往以平缓的角度开始加速，以较陡的角度结束运动。',
        singleTitle: 'XY单轴变化运动',
        single: '非卡通类单轴运动请不要使用elastic动画或增加运动轴向。',
        combinationTitle: 'XY双轴组合运动',
        combination:
          '九宫格类元素排序时，元素以直线路径补位运动，且层次满足真实整理排列顺序感，不以出画再入画的方式运动。',
        reduceTitle: '减少不必要的编排',
        reduce:
          '在页面加载的过程中，我们提供骨架屏组件来表示加载。基于中后台场景的特性，不建议在页面第一次载入时使用顺序动画来表示内容的顺序性，而是直接将页面呈现，或给予淡入淡出动画，以减少页面加载的时长和过多运动带来的注意力分散。',
      },
      check: {
        title: '动效自查表',
        intro: '为界面添加动效时，请参考本表对动效必要性作出自查筛选，保证动效合理性与必要性，符合 TDesign 价值观。',
        meaning: '我的动效对于界面的意义是？',
        solve: '动效解决了什么问题？是否符合一个或多个价值目标？',
        understand: '是否降低了用户理解成本？',
        entropy: '是否未造成系统的熵增？',
        perceived: '我的动效能够被明确感知吗？',
        category: '是否属于微观或宏观中的一类？',
        duration: '是否符合各端基本时长区间？',
        allEnds: '是否在各端上都可以被察觉？',
        allEndsDesc: '时长或曲线搭配我的元素尺寸若感知不明确，请加强',
        elegant: '我的动效优雅而平凡吗？',
        curve: '是否选用了适当的缓动曲线？',
        simple: '我的动效平凡吗？',
        simpleDesc: 'B端场景如果出现过于吸睛的动效，请考虑削弱',
        excessive: '我的动效是否过度编排？',
        static: '如果删除动效是否能静态地传递必要信息？',
        filename: '动效自查表.xls',
        download: '下载动效自查表',
      },
    },
    icon: {
      summaryTitle: '概述',
      summary:
        'Icon 作为 UI 构成中重要的元素，它一定程度上影响整体 UI 界面呈现出的风格，TDesign 提供一套适用于中后台场景的线性 Icon，以普适通用的标准进行设计，契合 TDesign 设计系统的整体风格。',
      principleTitle: '原则',
      simplicityTitle: '从简',
      simplicity:
        '制作时保证参数的简化，尽量消除小数点以及非整数的角度。处理线条以及轮廓时删除多余的锚点，输出时应避免出现不必要的装饰，保持图标的简洁。',
      accuracyTitle: '精确',
      accuracy:
        '在设计时避免使用那些含义模糊的图形，当同个事物存在多个图形表述时，应选取最为流通的样式，必要时进行针对性的强化。在图标输出时也应遵守命名规范，精确的文字描述便于他人查找。',
      moderationTitle: '适度',
      moderation:
        '单个图标作为一个独立的视觉个体，在线条的疏密以及图形的搭配上要呈现适度感。在处理一些必要的高密度图标时也要考虑线条的节奏感，让其舒适不压迫。系列图标要遵守适度原则，将变化控制在一定范围内。',
      specificationTitle: '规范',
      gridTitle: '栅格规范',
      grid: '栅格作为图表绘制的底层结构，是一切属性设计的基础。线条的长短粗细、图标的大小比例等关键因素均在其基础上制定。图标常见尺寸为16*16；20*20；24*24；32*32这四种输出尺寸。这些尺寸均可以清晰的显示在常规的显示器上。TDesign 最终选择以 24*24px 的尺寸作为图标绘制的统一栅格尺寸，经矢量转曲后等比缩放到 16*16px 交付。此方案旨在兼容 1.0 版本组件的默认调用尺寸，避免了额外调整图标大小的问题。',
      pixel:
        '受屏幕像素栅格化特性影响，非整数像素描边会因抗锯齿处理产生半透明灰度，导致图标边缘模糊、表意失真。因此，绘制时应严格对齐像素网格，以最大化保证图标的清晰度。',
      symmetry: '在处理一些对称图形时居中处理，不应为了对齐栅格而打破画面平衡。',
      canvasTitle: '画布与辅助线',
      canvas:
        '画布作为图标设计的实际操作区域起到了控制画面、限制大小、调整间距等作用。在 TDesign 图标的设计上实际画布应控制在栅格中心20*20px 的区域。在一些特殊情况下如 icon 过长或者有突出的边角等，允许内容适当延展，以确保图标视觉重量上的统一。',
      guidelines:
        '辅助线有助于约束图标的大小以及一些线条的走向，在制作时应尽量根据辅助线进行绘制以保持各图标间视觉重量的统一。我们对栅格内的圆形、方形、斜线等路径进行了规范并生成了一套辅助线系统。在图标设计的过程中应根据设计对象的特性选取相应的辅助线来控制图形样式。',
      guidelineChoice:
        '根据绘制对象的形象特征去选择辅助线，在必要时，可以将内容扩展到辅助线之外，不应为了对齐辅助线而妥协图形设计。',
      direction: '在绘制一些具有指向性的图标时，建议在其指引的反方向延伸微量（0.25px 倍数）的视觉内容，以便平衡画面。',
      lineTitle: '线条',
      line: '考虑通用普适性，本套系统中所有图标均设置为 2px 宽度的描边，并支持在{link}上进行全量化调节。',
      iconSite: '🔗 TDesign 图标独立站点',
      longLine: '在处理长线线条的长度时建议使用 2 的倍数，这样更易进行对称处理。',
      lineEnd: '线段末端直角处理，但在表现一些文字类图形或带有三维空间的透视图形时应与栅格相切。',
      cornersTitle: '圆角',
      corners: '在处理拐角时，需结合图形表意，恰当的圆角能强化视觉语言，而不是生硬地全部处理为尖角。',
      angleTitle: '角度',
      angle:
        '线条如需倾斜最好与栅格内 45° 辅助线相平行，或使用 15° 的倍数。以便在低分辨率的情况下仍有较高的线条清晰度。',
      negativeAngle: '不仅要注意图形部分的夹角，也要特别关注一些负形的夹角度数。',
      breaksTitle: '断口',
      breaks:
        '断口多存在于复合图标上，其宽度根据具体图标的样式进行具体分析，需起到平衡视觉重量的作用（最大宽度 ≤ 2px 且为 0.5px 的倍数）。',
      accessoryTitle: '叠加型通用挂件',
      accessory: '为在统一规范下适配多样的主图形，提供了中、小两套通用挂件。',
      accessoryUse: '使用时，需依据主图形的具体形态，选择合适尺寸并确定摆放位置。',
      complexityTitle: '繁简度',
      complexity: '在确保高识别度的基础上，寻求内部结构以及外部轮廓的最简化。',
      arcTitle: '弧线',
      arc: '弧线处理优先遵循正圆/正圆局部拼接。',
      visit: '打开 TDesign 图标独立站点',
    },
  },
};
