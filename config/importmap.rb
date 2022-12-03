# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "loci.js.erb"
pin "jquery" # @3.6.1
#pin "three" # @0.147.0
pin "three", to: "https://unpkg.com/three@0.147.0/build/three.module.js"
pin "three/addons/", to: "https://unpkg.com/three@0.147.0/examples/jsm/"
