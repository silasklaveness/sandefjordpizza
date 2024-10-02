import React from "react";

interface LogoLoaderProps {
  size?: number;
  color?: string;
}

export default function LogoLoader({
  size = 100,
  color = "#FEFEFE",
}: LogoLoaderProps = {}) {
  return (
    <div className="inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 1001 985"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M427.567 800.143C428.953 800.332 429.986 800.764 431.169 801.499C435.186 803.998 438.934 807.13 442.773 809.9L469.232 829.295C479.145 836.685 489.798 843.572 499.073 851.764C509.518 846.216 566.25 801.716 571.303 801.69C574.69 801.672 627.485 841.709 634.806 847.939C613.264 862.918 592.548 879.16 571.103 894.315C562.523 900.326 505.003 943.558 500.643 944.757C490.755 939.687 476.455 927.976 466.918 921.047L407.045 877.019C394.741 867.886 382.614 858.277 369.826 849.841C367.687 848.431 365.463 847.13 364.913 844.49C369.367 840.125 375.636 836.564 380.718 832.864L410.145 811.775C415.761 807.799 421.414 803.243 427.567 800.143Z M154.702 502.935C155.588 503.064 156.389 503.176 157.18 503.624C162.322 506.535 167.305 510.903 172.153 514.335C186.198 524.277 201.425 534.401 214.318 545.801C215.56 546.899 216.927 548.066 217.441 549.682C215.105 553.642 208.893 556.881 205.186 559.561C196.107 566.123 187.228 572.959 178.123 579.5C171.009 584.611 163.326 589.504 156.598 595.091C155.451 596.044 154.591 597.155 153.736 598.369C153.617 598.538 153.502 598.71 153.385 598.881C158.226 602.708 163.745 605.907 168.762 609.571C184.89 621.35 201.056 633.06 216.997 645.09C221.163 648.233 227.585 651.615 230.866 655.598C231.859 656.804 231.916 659.185 232.013 660.735C232.919 675.142 232.199 690.073 232.202 704.53L232.039 733.405C231.987 738.429 232.176 743.575 231.736 748.577L230.957 748.81C226.688 747.205 222.586 742.88 218.851 740.178C210.519 734.152 202.035 728.382 193.792 722.225C171.438 706.268 149.594 689.735 127.464 673.487C107.025 658.481 86.2686 643.936 65.9199 628.775L35.0702 605.676C31.7427 603.206 27.1516 600.885 24.2937 597.977L24.4313 597.104C26.0242 594.84 28.1567 593.145 30.326 591.46C44.3248 580.588 58.9703 570.55 73.4316 560.31L118.658 528.159C125.815 523.154 132.872 518.013 139.952 512.902C144.705 509.471 149.522 505.682 154.702 502.935Z M500.806 20.8426C504.707 22.1519 508.613 25.8322 512.031 28.1806C525.138 37.1861 537.955 46.5705 550.929 55.7607L640.414 119.788C663.901 136.324 687.315 152.936 710.453 169.961C718.423 175.824 726.719 181.508 734.499 187.6C736.072 188.832 736.54 190.141 736.771 192.072C737.497 198.137 737.087 204.629 737.092 210.736L736.77 250.001L736.233 374.5L736.234 416.55C736.245 425.738 735.87 435.03 736.773 444.181C765.643 425.225 793.538 404.244 821.256 383.644L838.772 370.659C841.904 368.383 845.636 366.295 848.357 363.557C848.296 362.089 847.297 361.131 846.248 360.157C840.667 354.977 833.634 350.616 827.475 346.121L789.541 318.646C784.798 315.265 776.16 310.35 772.744 305.959C771.73 304.654 771.682 302.965 771.565 301.377C771.191 296.28 771.402 290.989 771.38 285.873L771.462 252.165C771.498 241.109 770.566 225.684 771.834 215.128L771.919 214.456C776.225 217.06 780.058 220.633 784.173 223.566C793.609 230.293 803.22 236.717 812.604 243.544L885.871 296.558L934.307 331.016C948.675 341.07 964.11 351.041 976.78 363.198C957.626 376.499 939.388 391.376 920.523 405.125L719.822 552.175L614.922 628.174L582.358 651.623C578.516 654.42 573.152 657.342 569.955 660.817C568.907 661.955 569.067 662.58 568.999 664.015C578.963 672.016 589.901 679.274 600.279 686.76C612.418 695.517 624.312 704.605 636.321 713.536C645.104 720.068 653.995 726.305 662.595 733.088C664.651 732.406 666.462 731.667 668.281 730.463C675.874 725.433 683.128 719.722 690.481 714.336L730.516 685.356L817.408 623.514C825.242 617.859 844.661 605.555 849.897 598.955C843.548 595.017 837.614 590.42 831.555 586.056C821.144 578.557 810.794 571.015 800.527 563.321C795.254 559.37 789.338 556.023 784.247 551.933C784.304 551.005 784.215 550.776 784.75 549.955C786.3 547.575 836.666 511.274 842.866 507.314C844.371 506.353 845.831 505.545 847.587 505.154C853.587 506.869 863.833 516.026 869.534 520.013C879.25 527.721 889.616 534.577 899.661 541.84C914.498 552.566 929.114 563.581 944.021 574.211C952.603 580.332 961.104 586.374 969.456 592.811C972.707 595.317 976.272 597.73 979.135 600.662C979.067 600.95 979.1 601.283 978.932 601.526C978.261 602.494 971.97 605.911 970.54 606.937L879.104 672.559L666.174 825.721C660.427 822.466 654.967 817.995 649.606 814.124C638.23 805.911 626.984 797.598 615.819 789.101C589.179 768.826 561.992 749.302 534.919 729.616C523.057 720.991 511.562 711.029 499.176 703.242C493.646 708.834 486.237 713.081 479.855 717.696L432.825 751.238L369.135 797.416C361.686 802.82 354.148 808.097 346.612 813.377C342.136 816.513 337.742 819.963 332.922 822.551C331.447 822.516 330.152 821.612 328.958 820.814C317.046 812.849 305.664 803.746 294.016 795.369C286.457 789.933 275.08 782.915 268.552 776.949C266.826 775.371 265.717 774.239 265.387 771.852C264.443 765.031 264.977 757.669 264.987 750.766L265.006 713.991L264.959 597.111L265.001 560.835C265.034 553.026 265.361 545.125 264.915 537.329C259.807 532.567 252.986 528.497 247.327 524.338L200.354 490.373L80.6127 403.018C62.6577 389.845 44.2634 377.132 26.6785 363.469C25.425 362.495 24.2989 361.711 24.0859 360.122C25.5753 357.492 112.132 297.082 122.258 289.798L379.165 106.611L463.487 46.534C475.66 37.9914 487.852 28.0776 500.806 20.8426ZM499.286 113.328C468.42 134.243 438.425 156.391 408.036 177.977L243.807 295.506C221.601 311.644 198.753 326.88 176.623 343.125C169.242 348.542 160.469 353.793 153.992 360.165C154.701 362.385 156.877 364.126 158.627 365.573C171.383 376.121 185.64 385.247 198.883 395.199L230.502 418.738C235.78 422.656 241.316 427.605 247.094 430.62C247.641 430.904 248.18 431.128 248.754 431.348C257.824 425.655 266.625 418.898 275.33 412.641L323.374 378.15L390.387 330.693C398.894 324.654 420.843 310.529 426.648 303.314C427.007 302.868 427.397 302.439 427.768 302.003C420.776 296.239 413.033 291.235 405.664 285.959C397.172 279.879 388.885 273.517 380.433 267.379C375.054 263.472 368.162 259.549 363.659 254.77C363.817 253.54 364.002 253.123 364.982 252.326C370.833 247.567 377.681 243.513 383.797 239.028C395.79 230.232 409.42 219.542 421.788 211.716C423.158 210.849 424.523 210.091 426.119 209.747C431.145 210.807 438.685 217.878 443.132 221.138C450.105 226.25 491.601 257.213 496.524 257.98C497.8 258.179 499.798 256.794 500.816 256.131C508.458 251.159 515.743 245.461 523.167 240.16C533.669 232.66 544.336 225.397 554.921 218.015C559.039 215.143 562.792 211.403 567.102 208.88C568.375 208.135 569.342 207.624 570.844 207.935C572.268 208.23 573.551 208.929 574.77 209.695C581.161 213.714 587.088 218.877 593.251 223.284L619.528 242.02C624.127 245.347 629.741 248.727 633.506 252.942C633.02 254.523 632.201 255.373 630.948 256.398C628.41 258.474 625.502 260.21 622.845 262.146L595.93 281.432L540.872 321.169L512.043 341.866C508.189 344.624 504.115 348.223 499.987 350.438C497.319 351.869 494.075 352.192 491.485 353.727C483.805 358.282 476.378 364.367 469.055 369.564L421.571 403.535L350.854 454.296C339.294 462.543 327.757 472.132 315.125 478.589L316.702 483.009C337.366 496.798 357.318 512.042 377.378 526.727L405.609 547.649C411.102 551.692 416.926 555.535 422.206 559.839C423.052 560.529 423.677 561.23 423.969 562.313C424.162 563.025 424.009 563.504 423.563 564.101C421.968 566.241 366.506 605.665 361.978 607.903C354.946 603.906 347.846 597.557 341.678 592.26C340.858 594.008 340.019 595.717 339.855 597.667C339.329 603.92 339.693 610.445 339.73 616.719L340.051 651.26C340.262 673.91 339.444 696.745 340.437 719.364C340.547 721.868 340.643 724.315 341.471 726.703C341.903 726.693 402.137 683.084 409.581 677.814L582.001 554.613L644.229 510.205L665.316 495.289C669.003 492.664 673.448 490.044 676.572 486.794C677.449 485.882 678.165 484.775 678.857 483.721L678.19 483.152C665.365 472.314 574.232 409.675 572.36 405.451C573.102 403.808 574.312 402.717 575.699 401.596C587.372 392.155 600.429 383.79 612.692 375.101C617.762 371.508 626.085 364.226 631.529 362.182C633.087 361.597 634.781 362.314 636.176 363.018C643.707 366.816 653.1 374.399 659.299 380.201C661.498 370.802 660.386 353.235 660.446 342.683L660.884 274.143L661.001 246.264C661.045 240.452 661.406 234.444 660.865 228.657C659.73 226.854 658.045 225.533 656.374 224.245C636.887 209.232 616.149 195.479 596.126 181.148C585.692 173.68 504.587 114.189 500.707 113.327C500.184 113.211 499.794 113.28 499.286 113.328Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
