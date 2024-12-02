/*
    FEATURE IMPROVEMENTS
    - Move when the animitation for telegrab has been performed instead of waiting
    - Add more options to Mass besides from killing ghosts / bandaging players
    - Use Bone Dagger as spec to gaurntee hit
    - unequip gear on booster alt
/*

/*
    FEATURE ADDITIONS
    - Find a way to check for Zeal Gained, and add it to a counter for the GUI
    - Add onStart check params. ie if alt and 10hp account and no fire staff in inventory
    - add spec attack logic; dynamically pull the equipped item, check for spec %, check for spec% for 
        player remaining, spec if greater than spec % needed
/*

/*
    BUG BACKLOG
    -

*/

/* Swing UI */
var imports = new JavaImporter(
    javax.swing,
    java.awt,
    java.awt.event
);

with(imports) {
    var frame = new JFrame('Nidge Auto Soul Wars');
    frame.setSize(1000, 1000);
    frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

    var mainPanel = new JPanel(new GridLayout(0, 2));
    mainPanel.setBackground(Color.DARK_GRAY);

    var titleLabel = new JLabel('Nidge Auto Soul Wars');
    var font = new Font('Comic Sans', Font.BOLD, 24);
    titleLabel.setFont(font);
    titleLabel.setHorizontalAlignment(JLabel.CENTER);
    titleLabel.setOpaque(true);
    titleLabel.setBackground(Color.DARK_GRAY);
    titleLabel.setForeground(Color.WHITE);

    var methodSelectionPanel = new JPanel(new GridLayout(0, 1));
    methodSelectionPanel.setBackground(Color.DARK_GRAY);
    methodSelectionPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createLineBorder(Color.WHITE), "Select Method"));
    methodSelectionPanel.border.titleColor = Color.WHITE;

    var doloMethodOneRadio = new JRadioButton('Dolo Method One');
    var doloMethodTwoRadio = new JRadioButton('Dolo Method Two');
    var massMethodRadio = new JRadioButton('Mass Method');

    doloMethodOneRadio.setForeground(Color.WHITE);
    doloMethodTwoRadio.setForeground(Color.WHITE);
    massMethodRadio.setForeground(Color.WHITE);

    doloMethodOneRadio.setBackground(Color.DARK_GRAY);
    doloMethodTwoRadio.setBackground(Color.DARK_GRAY);
    massMethodRadio.setBackground(Color.DARK_GRAY);

    var methodGroup = new ButtonGroup();
    methodGroup.add(doloMethodOneRadio);
    methodGroup.add(doloMethodTwoRadio);
    methodGroup.add(massMethodRadio);

    methodSelectionPanel.add(doloMethodOneRadio);
    methodSelectionPanel.add(doloMethodTwoRadio);
    methodSelectionPanel.add(massMethodRadio);

    doloMethodOneRadio.setActionCommand('doloMethodOne');
    doloMethodTwoRadio.setActionCommand('doloMethodTwo');
    massMethodRadio.setActionCommand('massMethod');

    var doloMethodOneRadioSelectedDefault = api.getBooleanFromCache('.method doloOne', api.getBooleanVariable('.method doloOne'));
    var doloMethodTwoRadioSelectedDefault = api.getBooleanFromCache('.method doloTwo', api.getBooleanVariable('.method doloTwo'));
    var massMethodRadioSelectedDefault = api.getBooleanFromCache('.method mass', api.getBooleanVariable('.method mass'));

    doloMethodOneRadio.setSelected(doloMethodOneRadioSelectedDefault);
    doloMethodTwoRadio.setSelected(doloMethodTwoRadioSelectedDefault);
    massMethodRadio.setSelected(massMethodRadioSelectedDefault);

    var configPanel = new JPanel(new GridLayout(0, 2));
    configPanel.setBackground(Color.DARK_GRAY);
    configPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createLineBorder(Color.WHITE), "Configurations"));
    configPanel.border.titleColor = Color.WHITE;

    var playerTypeLabel = new JLabel('Player Type:');
    playerTypeLabel.setForeground(Color.WHITE);

    var mainPlayerConfigRadio = new JRadioButton('Main Player');
    var altPlayerConfigRadio = new JRadioButton('Alt Player');

    var mainPlayerConfigRadioDefault = api.getBooleanFromCache('.mainPlayer', api.getBooleanVariable('.mainPlayer'));
    var altPlayerConfigRadioDefault = api.getBooleanFromCache('.altPlayer', api.getBooleanVariable('.altPlayer'));

    mainPlayerConfigRadio.setSelected(mainPlayerConfigRadioDefault);
    altPlayerConfigRadio.setSelected(altPlayerConfigRadioDefault);

    mainPlayerConfigRadio.setForeground(Color.WHITE);
    altPlayerConfigRadio.setForeground(Color.WHITE);

    mainPlayerConfigRadio.setBackground(Color.DARK_GRAY);
    altPlayerConfigRadio.setBackground(Color.DARK_GRAY);

    var playerTypeGroup = new ButtonGroup();
    playerTypeGroup.add(mainPlayerConfigRadio);
    playerTypeGroup.add(altPlayerConfigRadio);

    mainPlayerConfigRadio.setActionCommand('mainPlayer');
    altPlayerConfigRadio.setActionCommand('altPlayer');

    var opposingPlayerLabel = new JLabel('Opposing Player IGN:');
    opposingPlayerLabel.setForeground(Color.WHITE);
    var opposingPlayerField = new JTextField();

    var opposingPlayerVal = api.getStringFromCache('.opposingPlayer', api.getStringVariable('.opposingPlayer'));
    opposingPlayerField.setText(opposingPlayerVal);

    var attackStyleLabel = new JLabel('Attack Style:');
    attackStyleLabel.setForeground(Color.WHITE);

    var mageRadio = new JRadioButton('Mage');
    var rangeRadio = new JRadioButton('Range');
    var meleeRadio = new JRadioButton('Melee');

    var mageRadioDefault = api.getBooleanFromCache('.styleMage', api.getBooleanVariable('.styleMage'));
    var rangeRadioDefault = api.getBooleanFromCache('.styleRange', api.getBooleanVariable('.styleRange'));
    var meleeDefault = api.getBooleanFromCache('.styleMelee', api.getBooleanVariable('.styleMelee'));

    mageRadio.setSelected(mageRadioDefault);
    rangeRadio.setSelected(rangeRadioDefault);
    meleeRadio.setSelected(meleeDefault);

    mageRadio.setForeground(Color.WHITE);
    rangeRadio.setForeground(Color.WHITE);
    meleeRadio.setForeground(Color.WHITE);

    mageRadio.setBackground(Color.DARK_GRAY);
    rangeRadio.setBackground(Color.DARK_GRAY);
    meleeRadio.setBackground(Color.DARK_GRAY);

    var attackStyleGroup = new ButtonGroup();
    attackStyleGroup.add(mageRadio);
    attackStyleGroup.add(rangeRadio);
    attackStyleGroup.add(meleeRadio);

    var soulToKillLabel = new JLabel('Forgotten Soul to Kill:');
    soulToKillLabel.setForeground(Color.WHITE);

    var level46Radio = new JRadioButton('Level-46');
    var level76Radio = new JRadioButton('Level-76');

    var level46RadioDefault = api.getBooleanFromCache('.level46Npc', api.getBooleanVariable('.level46Npc'));
    var level76RadioDefault = api.getBooleanFromCache('.level76Npc', api.getBooleanVariable('.level76Npc'));

    level46Radio.setSelected(level46RadioDefault);
    level76Radio.setSelected(level76RadioDefault);

    level46Radio.setForeground(Color.WHITE);
    level76Radio.setForeground(Color.WHITE);

    level46Radio.setBackground(Color.DARK_GRAY);
    level76Radio.setBackground(Color.DARK_GRAY);

    var soulToKillGroup = new ButtonGroup();
    soulToKillGroup.add(level46Radio);
    soulToKillGroup.add(level76Radio);

    configPanel.add(playerTypeLabel);
    configPanel.add(new JLabel());
    configPanel.add(mainPlayerConfigRadio);
    configPanel.add(altPlayerConfigRadio);
    configPanel.add(opposingPlayerLabel);
    configPanel.add(opposingPlayerField);
    configPanel.add(attackStyleLabel);
    configPanel.add(new JLabel());
    configPanel.add(mageRadio);
    configPanel.add(rangeRadio);
    configPanel.add(meleeRadio);
    configPanel.add(new JLabel());
    configPanel.add(soulToKillLabel);
    configPanel.add(new JLabel());
    configPanel.add(level46Radio);
    configPanel.add(level76Radio);

    var doloOnePanel = new JPanel(new GridLayout(0, 2));
    doloOnePanel.setBackground(Color.DARK_GRAY);
    doloOnePanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createLineBorder(Color.WHITE), "Dolo Method One"));
    doloOnePanel.border.titleColor = Color.WHITE;

    var fragmentsOneLabel = new JLabel('Fragments to collect:');
    fragmentsOneLabel.setForeground(Color.WHITE);
    var fragmentsOneField = new JTextField();

    var fragOneVal = api.getIntFromCache('.fragmentsDoloOne', api.getIntVariable('.fragmentsDoloOne'));
    fragmentsOneField.setText(fragOneVal);

    var damageOneLabel = new JLabel('Damage to deal to Avatar:');
    damageOneLabel.setForeground(Color.WHITE);
    var damageOneField = new JTextField();

    var damageOneVal = api.getIntFromCache('.damageToAvatar', api.getIntVariable('.damageToAvatar'));
    damageOneField.setText(damageOneVal);

    doloOnePanel.add(fragmentsOneLabel);
    doloOnePanel.add(fragmentsOneField);

    doloOnePanel.add(damageOneLabel);
    doloOnePanel.add(damageOneField);

    var doloTwoPanel = new JPanel(new GridLayout(0, 2));
    doloTwoPanel.setBackground(Color.DARK_GRAY);
    doloTwoPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createLineBorder(Color.WHITE), "Dolo Method Two"));
    doloTwoPanel.border.titleColor = Color.WHITE;

    var fragmentsTwoLabel = new JLabel('Fragments to collect:');
    fragmentsTwoLabel.setForeground(Color.WHITE);
    var fragmentsTwoField = new JTextField();

    var fragTwoVal = api.getIntFromCache('.fragmentsDoloTwo', api.getIntVariable('.fragmentsDoloTwo'));
    fragmentsTwoField.setText(fragTwoVal);

    var hpAccountCheckBox = new JCheckBox('Main is 10hp Account?');
    hpAccountCheckBox.setForeground(Color.WHITE);
    hpAccountCheckBox.setBackground(Color.DARK_GRAY);

    var tenHpAccVal = api.getBooleanFromCache('.tenHpAccount', api.getBooleanVariable('.tenHpAccount'));
    hpAccountCheckBox.setSelected(tenHpAccVal);

    var weaponIDLabel = new JLabel('WeaponID:');
    weaponIDLabel.setForeground(Color.WHITE);
    var weaponIDField = new JTextField();

    var wepIDVal = api.getIntFromCache('.weaponID', api.getIntVariable('.weaponID'));
    weaponIDField.setText(wepIDVal);

    doloTwoPanel.add(fragmentsTwoLabel);
    doloTwoPanel.add(fragmentsTwoField);
    doloTwoPanel.add(hpAccountCheckBox);
    doloTwoPanel.add(new JLabel());
    doloTwoPanel.add(weaponIDLabel);
    doloTwoPanel.add(weaponIDField);

    var massPanel = new JPanel(new GridLayout(0, 1));
    massPanel.setBackground(Color.DARK_GRAY);
    massPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createLineBorder(Color.WHITE), "Mass Method"));
    massPanel.border.titleColor = Color.WHITE;

    var killGhostsRadio = new JRadioButton('Kill Ghosts');
    var bandagePlayersRadio = new JRadioButton('Bandage Players');

    var killGhostsRadioDefault = api.getBooleanFromCache('.killGhosts', api.getBooleanVariable('.killGhosts'));
    var bandagePlayersRadioDefault = api.getBooleanFromCache('.bandagePlayers', api.getBooleanVariable('.bandagePlayers'));

    killGhostsRadio.setSelected(killGhostsRadioDefault);
    bandagePlayersRadio.setSelected(bandagePlayersRadioDefault);

    killGhostsRadio.setForeground(Color.WHITE);
    bandagePlayersRadio.setForeground(Color.WHITE);

    killGhostsRadio.setBackground(Color.DARK_GRAY);
    bandagePlayersRadio.setBackground(Color.DARK_GRAY);

    var massGroup = new ButtonGroup();
    massGroup.add(killGhostsRadio);
    massGroup.add(bandagePlayersRadio);

    massPanel.add(killGhostsRadio);
    massPanel.add(bandagePlayersRadio);

    var startButton = new JButton('Start Bot');
    startButton.setBackground(Color.DARK_GRAY);
    startButton.setForeground(Color.WHITE);

    startButton.addActionListener(function(e) {
        startBot();
        frame.dispose();
    });

    function setEnabledForDoloOne(enabled) {
        fragmentsOneField.setEnabled(enabled);
        damageOneField.setEnabled(enabled);
    }

    function setEnabledForDoloTwo(enabled) {
        fragmentsTwoField.setEnabled(enabled);
        hpAccountCheckBox.setEnabled(enabled);
        weaponIDField.setEnabled(enabled && hpAccountCheckBox.isSelected() && altPlayerConfigRadio.isSelected());
    }

    function setEnabledForMass(enabled) {
        killGhostsRadio.setEnabled(enabled);
        bandagePlayersRadio.setEnabled(enabled);
    }

    // radio buttons

    doloMethodOneRadio.addActionListener(function(e) {
        setEnabledForDoloOne(true);
        setEnabledForDoloTwo(false);
        setEnabledForMass(false);

        var selectedButtonModel = methodGroup.getSelection();

        if (selectedButtonModel !== null) {
            var selectedRadioButton = selectedButtonModel.getActionCommand();
            if (selectedRadioButton == 'doloMethodOne') {
                api.setVariable('.method doloOne', true);
                api.saveBooleanToCache('.method doloOne', true);

                api.setVariable('.method doloTwo', false);
                api.saveBooleanToCache('.method doloTwo', false);

                api.setVariable('.method mass', false);
                api.saveBooleanToCache('.method mass', false);
            }
        }
    });

    doloMethodTwoRadio.addActionListener(function(e) {
        setEnabledForDoloOne(false);
        setEnabledForDoloTwo(true);
        setEnabledForMass(false);

        var selectedButtonModel = methodGroup.getSelection();

        if (selectedButtonModel !== null) {
            var selectedRadioButton = selectedButtonModel.getActionCommand();

            if (selectedRadioButton == 'doloMethodTwo') {
                api.setVariable('.method doloOne', false);
                api.saveBooleanToCache('.method doloOne', false);

                api.setVariable('.method doloTwo', true);
                api.saveBooleanToCache('.method doloTwo', true);

                api.setVariable('.method mass', false);
                api.saveBooleanToCache('.method mass', false);
            }
        }
    });

    massMethodRadio.addActionListener(function(e) {
        setEnabledForDoloOne(false);
        setEnabledForDoloTwo(false);
        setEnabledForMass(true);

        var selectedButtonModel = methodGroup.getSelection();

        if (selectedButtonModel !== null) {
            var selectedRadioButton = selectedButtonModel.getActionCommand();

            if (selectedRadioButton == 'massMethod') {
                api.setVariable('.method doloOne', false);
                api.saveBooleanToCache('.method doloOne', false);

                api.setVariable('.method doloTwo', false);
                api.saveBooleanToCache('.method doloTwo', false);

                api.setVariable('.method mass', true);
                api.saveBooleanToCache('.method mass', true);
            }
        }
    });

    mainPlayerConfigRadio.addActionListener(function(e) {
        if (mainPlayerConfigRadio.isSelected()) {
            api.setVariable('.mainPlayer', true);
            api.saveBooleanToCache('.mainPlayer', true);

            api.setVariable('.altPlayer', false);
            api.saveBooleanToCache('.altPlayer', false);

            weaponIDField.setEnabled(false);
        }
    });

    altPlayerConfigRadio.addActionListener(function(e) {
        if (altPlayerConfigRadio.isSelected()) {
            api.setVariable('.mainPlayer', false);
            api.saveBooleanToCache('.mainPlayer', false);

            api.setVariable('.altPlayer', true);
            api.saveBooleanToCache('.altPlayer', true);

            weaponIDField.setEnabled(hpAccountCheckBox.isSelected());
        }
    });

    mageRadio.addActionListener(function(e) {
        if (mageRadio.isSelected()) {
            api.setVariable('.styleMage', true);
            api.saveBooleanToCache('.styleMage', true);

            api.setVariable('.styleRange', false);
            api.saveBooleanToCache('.styleRange', false);

            api.setVariable('.styleMelee', false);
            api.saveBooleanToCache('.styleMelee', false);
        }
    });

    rangeRadio.addActionListener(function(e) {
        if (rangeRadio.isSelected()) {
            api.setVariable('.styleMage', false);
            api.saveBooleanToCache('.styleMage', false);

            api.setVariable('.styleRange', true);
            api.saveBooleanToCache('.styleRange', true);

            api.setVariable('.styleMelee', false);
            api.saveBooleanToCache('.styleMelee', false);
        }
    });

    meleeRadio.addActionListener(function(e) {
        if (meleeRadio.isSelected()) {
            api.setVariable('.styleMage', false);
            api.saveBooleanToCache('.styleMage', false);

            api.setVariable('.styleRange', false);
            api.saveBooleanToCache('.styleRange', false);

            api.setVariable('.styleMelee', true);
            api.saveBooleanToCache('.styleMelee', true);
        }
    });

    level46Radio.addActionListener(function(e) {
        if (level46Radio.isSelected()) {
            api.setVariable('.level46Npc', true);
            api.saveBooleanToCache('.level46Npc', true);

            api.setVariable('.level76Npc', false);
            api.saveBooleanToCache('.level76Npc', false);
        }
    });

    level76Radio.addActionListener(function(e) {
        if (level76Radio.isSelected()) {
            api.setVariable('.level46Npc', false);
            api.saveBooleanToCache('.level46Npc', false);

            api.setVariable('.level76Npc', true);
            api.saveBooleanToCache('.level76Npc', true);
        }
    });

    killGhostsRadio.addActionListener(function(e) {
        if (killGhostsRadio.isSelected()) {
            api.setVariable('.killGhosts', true);
            api.saveBooleanToCache('.killGhosts', true);

            api.setVariable('.bandagePlayers', false);
            api.saveBooleanToCache('.bandagePlayers', false);
        }
    });

    bandagePlayersRadio.addActionListener(function(e) {
        if (bandagePlayersRadio.isSelected()) {
            api.setVariable('.killGhosts', false);
            api.saveBooleanToCache('.killGhosts', false);

            api.setVariable('.bandagePlayers', true);
            api.saveBooleanToCache('.bandagePlayers', true);
        }
    });

    hpAccountCheckBox.addActionListener(function(e) {
        if (hpAccountCheckBox.isSelected()) {
            api.setVariable('.tenHpAccount', true);
            api.saveBooleanToCache('.tenHpAccount', true);
        } else {
            api.setVariable('.tenHpAccount', false);
            api.saveBooleanToCache('.tenHpAccount', false);
        }
    });

    //input fields

    opposingPlayerField.addFocusListener(new JavaAdapter(FocusAdapter, {
        focusLost: function(e) {
            var opposingPlayer = opposingPlayerField.getText();
            api.setVariable('.opposingPlayer', opposingPlayer);
            api.saveStringToCache('.opposingPlayer', opposingPlayer);
        }
    }));

    fragmentsOneField.addFocusListener(new JavaAdapter(FocusAdapter, {
        focusLost: function(e) {
            var fragmentsDoloOneVal = parseInt(fragmentsOneField.getText(), 10);
            api.setVariable('.fragmentsDoloOne', fragmentsDoloOneVal);
            api.saveStringToCache('.fragmentsDoloOne', fragmentsDoloOneVal);
        }
    }));

    fragmentsTwoField.addFocusListener(new JavaAdapter(FocusAdapter, {
        focusLost: function(e) {
            var fragmentsDoloTwoVal = parseInt(fragmentsTwoField.getText(), 10);
            api.setVariable('.fragmentsDoloTwo', fragmentsDoloTwoVal);
            api.saveStringToCache('.fragmentsDoloTwo', fragmentsDoloTwoVal);
        }
    }));

    weaponIDField.addFocusListener(new JavaAdapter(FocusAdapter, {
        focusLost: function(e) {
            var weaponIDVal = parseInt(weaponIDField.getText(), 10);
            api.setVariable('.weaponID', weaponIDVal);
            api.saveStringToCache('.weaponID', weaponIDVal);
        }
    }));

    damageOneField.addFocusListener(new JavaAdapter(FocusAdapter, {
        focusLost: function(e) {
            var damageToAvatar = parseInt(damageOneField.getText(), 10);
            api.setVariable('.damageToAvatar', damageToAvatar);
            api.saveStringToCache('.damageToAvatar', damageToAvatar);
        }
    }));


    hpAccountCheckBox.addActionListener(function(e) {
        if (altPlayerConfigRadio.isSelected()) {
            weaponIDField.setEnabled(hpAccountCheckBox.isSelected());
        }
    });

    mainPanel.add(titleLabel);
    mainPanel.add(methodSelectionPanel);
    mainPanel.add(configPanel);
    mainPanel.add(doloOnePanel);
    mainPanel.add(doloTwoPanel);
    mainPanel.add(massPanel);

    frame.add(mainPanel, BorderLayout.CENTER);
    frame.add(startButton, BorderLayout.SOUTH);

    setEnabledForDoloOne(false);
    setEnabledForDoloTwo(false);
    setEnabledForMass(false);
    weaponIDField.setEnabled(false);

    frame.setVisible(true);

    function startBot() {
        CONFIG_SET = true;
        startScript();
    }
}

/* default var declarations */
var mainPlayer,
    opposingPlayerIGN,
    massWorld,
    bandagePlayersMethod,
    tenHpAccount,
    doloMethodOne,
    doloMethodTwo,
    soul46,
    soul76,
    gameRoundColor,
    damageToDeal,
    weaponID,
    bandageBenchID,
    potionBenchID,
    exitPortalID,
    enemyAvatarLocation,
    altDeathTileLocation,
    mainKillTileLocation,
    ghostKillLocation,
    sceneLoadLocation,
    checkpointAvatarLocationOne,
    checkpointAvatarLocationTwo,
    lobbyCornerLocation,
    graveyardOneLocation,
    graveyardTwoLocation,
    bridgeTileLocationOne,
    bridgeTileLocationTwo,
    capObeliskLocation,
    deathArea,
    respawnArea,
    barrierName,
    fragmentAmount,
    startLootFragments,
    previousFragmentAmount,
    zealGained,
    styleMage,
    styleRange,
    styleMelee,
    ghostsToKillStatic,
    ghostsToKillDynamic;

/* static object, npc & location value declarations */
var mainState = 0,
    subState = 0,
    timeout = 0,
    soulFragmentID = 25201,
    ghostIDs = [10534, 10535, 10537, 10536],
    innactiveObelisk = 40449,
    redCapObelisk = 40451,
    blueCapObelisk = 40450,
    potionOfPowerID = 25203,
    bandageID = 25202,
    redTeamCloak = 25207,
    blueTeamCloak = 25208,
    locatorOrb = 22081,
    rockCake = 7510,
    menuActionState = 0,
    damageDealtOnAvatar = 0,
    fireStaff = 1387,
    restorePots = [25203, 25204, 25205, 25206],
    zealCounter = 0,
    startAtZeal,
    regex = /\d+/,
    hasPassedBarrier = false,
    hasChallengedPlayer = false,
    isPlayerLooting = false,
    enableLootingLogic = false,
    playerDeath = false,
    obeliskCaptured = false,
    graveyardOneCaptured = false,
    graveyardTwoCaptured = false,
    stateHasReset = false,
    shouldPray = false,
    handedInFragments = false,
    outsideBarrierStartLocation = new net.runelite.api.coords.WorldPoint(2219, 2842, 0),
    insideBarrierStartLocation = new net.runelite.api.coords.WorldPoint(2220, 2842, 0),
    outsideMassBarrierStartLocation = new net.runelite.api.coords.WorldPoint(2200, 2842, 0),
    insideMassBarrierStartLocation = new net.runelite.api.coords.WorldPoint(2199, 2842, 0);

/* api methods */

function onGameTick() {
    if (timeout > 0) {
        return timeout--;
    };

    if (!(doloMethodOne || doloMethodTwo || massWorld)) {
        return timeout = 1;
    }

    if (shouldRestorePrayer()) {
        sipPotion();

        return timeout = 1;
    }

    if (shouldUseBandage()) {
        useBandage();
        return timeout = 1;
    }

    if (shouldPray) {
        if (!client.isPrayerActive(net.runelite.api.Prayer.PROTECT_FROM_MELEE)) {
            togglePrayers();
        }
    } else {
        if (client.isPrayerActive(net.runelite.api.Prayer.PROTECT_FROM_MELEE)) {
            togglePrayers();
        }
    }

    if (isInResetArea(client.getLocalPlayer()) && !stateHasReset) {
        resetStates();
        stateHasReset = true;

        return timeout = 1;
    }

    // control logic for the 'main' player for Dolo method 1
    if (mainPlayer && doloMethodOne) {
        switch (mainState) {
            case 0:
                api.setCounter('Main State', 0)
                setupGameRound();
                break;
            case 1:
                api.setCounter('Main State', 1)
                soulWarsRoundMainDoloOne();
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    // control logic for the 'main' player for Dolo method 2
    if (mainPlayer && doloMethodTwo) {
        switch (mainState) {
            case 0:
                api.setCounter('Main State', 0)
                setupGameRound();
                break;
            case 1:
                api.setCounter('Main State', 1)
                soulWarsRoundMainDoloTwo();
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    // control logic for the 'alt' player for dolo method one
    if (!mainPlayer && !massWorld && doloMethodOne) {
        switch (mainState) {
            case 0:
                api.setCounter('Main State', 0)
                setupGameRound();
                break;
            case 1:
                api.setCounter('Main State', 1)
                soulWarsRoundAltDoloOne();
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    // control logic for the 'alt' player for dolo method two
    if (!mainPlayer && !massWorld && doloMethodTwo) {
        switch (mainState) {
            case 0:
                api.setCounter('Main State', 0)
                setupGameRound();
                break;
            case 1:
                api.setCounter('Main State', 1)
                soulWarsRoundAltDoloTwo();
                break;
            case 2:
                break;
            default:
                break;
        }
    }

    if (massWorld) {
        switch (mainState) {
            case 0:
                api.setCounter('Main State', 0)
                setupGameRound();
                break;
            case 1:
                api.setCounter('Main State', 1)
                soulWarsRoundMass();
                break;
            case 2:
                break;
            default:
                break;
        }
    }
}

function startScript() {
    api.PrintDebugMessage('[ASW - BETA] v2.4 - Bone Dagger support | Added counter for Zeal Gained');
    mapOnStartValues();
}

/* core methods */

function mapOnStartValues() {
    doloMethodOne = api.getBooleanFromCache('.method doloOne', api.getBooleanVariable('.method doloOne'))
    doloMethodTwo = api.getBooleanFromCache('.method doloTwo', api.getBooleanVariable('.method doloTwo'))
    massWorld = api.getBooleanFromCache('.method mass', api.getBooleanVariable('.method mass'))

    startAtZeal = client.getVarpValue(2871);

    tenHpAccount = api.getBooleanFromCache('.tenHpAccount', api.getBooleanVariable('.tenHpAccount'));
    weaponID = api.getIntFromCache('.weaponID', api.getIntVariable('.weaponID'));
    mainPlayer = api.getBooleanFromCache('.mainPlayer', api.getBooleanVariable('.mainPlayer'));
    altPlayer = api.getBooleanFromCache('.altPlayer', api.getBooleanVariable('.altPlayer'));
    opposingPlayerIGN = api.getStringFromCache('.opposingPlayer', api.getStringVariable('.opposingPlayer'));
    soul46 = api.getBooleanFromCache('.level46Npc', api.getBooleanVariable('.level46Npc'));
    soul76 = api.getBooleanFromCache('.level76Npc', api.getBooleanVariable('.level76Npc'));

    styleMage = api.getBooleanFromCache('.styleMage', api.getBooleanVariable('.styleMage'));
    styleRange = api.getBooleanFromCache('.styleRange', api.getBooleanVariable('.styleRange'));
    styleMelee = api.getBooleanFromCache('.styleMelee', api.getBooleanVariable('.styleMelee'));

    killGhostsMethod = api.getBooleanFromCache('.killGhosts', api.getBooleanVariable('.killGhosts'));
    bandagePlayersMethod = api.getBooleanFromCache('.bandagePlayers', api.getBooleanVariable('.bandagePlayers'));

    if (doloMethodOne) {
        fragmentAmount = api.getIntFromCache('.fragmentsDoloOne', api.getIntVariable('.fragmentsDoloOne'));
        damageToDeal = api.getIntFromCache('.damageToAvatar', api.getIntVariable('.damageToAvatar'));
    } else if (doloMethodTwo || massWorld) {
        fragmentAmount = api.getIntFromCache('.fragmentsDoloTwo', api.getIntVariable('.fragmentsDoloTwo'));
        damageToDeal = 0;
    }

    if (soul46) {
        ghostsToKillStatic = fragmentAmount / 2;
        ghostsToKillDynamic = ghostsToKillStatic;
    } else if (soul76) {
        ghostsToKillStatic = fragmentAmount / 4;
        ghostsToKillDynamic = ghostsToKillStatic;
    }

    /* Game Start Debug Messages */
    mainPlayer && api.PrintDebugMessage('[ASW] Player Type: Main');
    altPlayer && api.PrintDebugMessage('[ASW] Player Type: Alt');
    opposingPlayerIGN && api.PrintDebugMessage('[ASW] Opposing Player IGN: ' + opposingPlayerIGN);
    fragmentAmount && api.PrintDebugMessage('[ASW] Fragment Amount to Gather: ' + fragmentAmount);
    damageToDeal && api.PrintDebugMessage('[ASW] Damage to Deal to Avatar: ' + damageToDeal);
}

function mapTeamSpecificValues() {
    if (isItemEquipped(redTeamCloak)) {
        gameRoundColor = 0;
        bandageBenchID = 40463;
        potionBenchID = 40469;
        exitPortalID = 40461;
        barrierName = 'Barrier';

        mainKillTileLocation = new net.runelite.api.coords.WorldPoint(2200, 2920, 0);
        sceneLoadLocation = new net.runelite.api.coords.WorldPoint(2232, 2906, 0);
        enemyAvatarLocation = new net.runelite.api.coords.WorldPoint(2127, 2896, 0);
        checkpointAvatarLocationOne = new net.runelite.api.coords.WorldPoint(2190, 2913, 0);
        checkpointAvatarLocationTwo = new net.runelite.api.coords.WorldPoint(2145, 2921, 0);
        lobbyCornerLocation = new net.runelite.api.coords.WorldPoint(2277, 2924, 0);
        graveyardOneLocation = new net.runelite.api.coords.WorldPoint(2252, 2920, 0);
        graveyardTwoLocation = new net.runelite.api.coords.WorldPoint(2163, 2903, 0);

        bridgeTileLocationOne = new net.runelite.api.coords.WorldPoint(2234, 2911, 0);
        bridgeTileLocationTwo = new net.runelite.api.coords.WorldPoint(2192, 2913, 0);

        respawnArea = redRespawnArea;
        altDeathArea = redDeathArea;

        if (soul76) {
            ghostKillLocation = new net.runelite.api.coords.WorldPoint(2212, 2890, 0);
        } else if (soul46) {
            ghostKillLocation = new net.runelite.api.coords.WorldPoint(2249, 2896, 0);
        }

        if (doloMethodOne) {
            altDeathTileLocation = new net.runelite.api.coords.WorldPoint(2221, 2902, 0);
            capObeliskLocation = new net.runelite.api.coords.WorldPoint(2205, 2912, 0);
        } else if (doloMethodTwo) {
            altDeathTileLocation = new net.runelite.api.coords.WorldPoint(2215, 2911, 0);
            capObeliskLocation = new net.runelite.api.coords.WorldPoint(2199, 2911, 0);
        }
    } else if (isItemEquipped(blueTeamCloak)) {
        gameRoundColor = 1;
        bandageBenchID = 40462;
        potionBenchID = 40468;
        exitPortalID = 40460;
        barrierName = 'Barrier';

        mainKillTileLocation = new net.runelite.api.coords.WorldPoint(2217, 2907, 0);
        sceneLoadLocation = new net.runelite.api.coords.WorldPoint(2183, 2920, 0);
        enemyAvatarLocation = new net.runelite.api.coords.WorldPoint(2287, 2928, 0);
        checkpointAvatarLocationOne = new net.runelite.api.coords.WorldPoint(2228, 2911, 0);
        checkpointAvatarLocationTwo = new net.runelite.api.coords.WorldPoint(2268, 2898, 0);
        lobbyCornerLocation = new net.runelite.api.coords.WorldPoint(2136, 2900, 0);

        graveyardOneLocation = new net.runelite.api.coords.WorldPoint(2163, 2903, 0);
        graveyardTwoLocation = new net.runelite.api.coords.WorldPoint(2252, 2920, 0);

        bridgeTileLocationOne = new net.runelite.api.coords.WorldPoint(2179, 2913, 0);
        bridgeTileLocationTwo = new net.runelite.api.coords.WorldPoint(2224, 2911, 0);

        altDeathArea = blueDeathArea;
        respawnArea = blueRespawnArea;

        if (soul76) {
            ghostKillLocation = new net.runelite.api.coords.WorldPoint(2206, 2930, 0);
        } else if (soul46) {
            ghostKillLocation = new net.runelite.api.coords.WorldPoint(2165, 2925, 0);
        }

        if (doloMethodOne) {
            altDeathTileLocation = new net.runelite.api.coords.WorldPoint(2195, 2925, 0);
            capObeliskLocation = new net.runelite.api.coords.WorldPoint(2205, 2912, 0);
        } else if (doloMethodTwo) {
            altDeathTileLocation = new net.runelite.api.coords.WorldPoint(2198, 2911, 0);
            capObeliskLocation = new net.runelite.api.coords.WorldPoint(2214, 2911, 0);
        }
    }
}

function setupGameRound() {
    switch (subState) {
        case 0:
            api.setCounter('Sub State', 0)
            moveToRoundStartLoc();

            return timeout = 2;
        case 1:
            api.setCounter('Sub State', 1)
            challengePlayer();

            return timeout = 2;
        case 2:
            api.setCounter('Sub State', 2)
            beginGameRound();

            return timeout = 1;
        default:
            break;
    }
}

function soulWarsRoundMainDoloOne() {
    switch (subState) {
        case 0:
            api.setCounter('Sub State', 0)
            return getPots();
        case 1:
            api.setCounter('Sub State', 1)
            return getBandages();
        case 2:
            api.setCounter('Sub State', 2)
            moveToOutsideBarrier();

            return timeout = 2;
        case 3:
            api.setCounter('Sub State', 3)
            return moveToGhostLocation();
        case 4:
            api.setCounter('Sub State', 4)
            obtainFragments();

            return timeout = 1;
        case 5:
            api.setCounter('Sub State', 5)
            moveToSceneLoadSpot();

            return timeout = 1;
        case 6:
            api.setCounter('Sub State', 6)
            captureObelisk();

            return timeout = 1;
        case 7:
            api.setCounter('Sub State', 7)
            moveToAltKillSpot();

            return timeout = 1;
        case 8:
            api.setCounter('Sub State', 8)
            killAlt();

            return timeout = 1;
        case 9:
            api.setCounter('Sub State', 9)
            telegrabFragments();

            return timeout = 1;
        case 10:
            api.setCounter('Sub State', 10)
            sacrificeFragments();

            return timeout = 1;
        case 11:
            api.setCounter('Sub State', 11)
            moveToEnemyAvatarPathOne();
            break;
        case 12:
            api.setCounter('Sub State', 12)
            moveToEnemyAvatarPathTwo();
            break;
        case 13:
            api.setCounter('Sub State', 13)
            moveToEnemyAvatarPathThree();
            break;
        case 14:
            api.setCounter('Sub State', 14)
            fightAvatar();
            break;
        default:
            break;
    }
}

function soulWarsRoundMainDoloTwo() {
    switch (subState) {
        case 0:
            api.setCounter('Sub State', 0)
            moveToOutsideBarrier();

            return timeout = 4;
        case 1:
            api.setCounter('Sub State', 1)
            return moveToGraveyardOneLocation();
        case 2:
            api.setCounter('Sub State', 2)
            captureGraveyardOne();

            return timeout = 1;
        case 3:
            api.setCounter('Sub State', 3)
            moveToBridgeTileLocationOne();

            return timeout = 1;
        case 4:
            api.setCounter('Sub State', 4)
            moveToObeliskLocation();

            return timeout = 1;
        case 5:
            api.setCounter('Sub State', 5)
            moveToBridgeTileLocationTwo();

            return timeout = 1;
        case 6:
            api.setCounter('Sub State', 6)
            moveToGraveyardTwoLocation();

            return timeout = 1;
        case 7:
            api.setCounter('Sub State', 7)
            captureGraveyardTwo();

            return timeout = 1;
        case 8:
            api.setCounter('Sub State', 8)
            moveToObeliskLocation();

            return timeout = 1;
        case 9:
            api.setCounter('Sub State', 9)
            captureObelisk();

            return timeout = 1;
        case 10:
            api.setCounter('Sub State', 10)
            killAltIfNot10hpAccount();

            return timeout = 1;
        case 11:
            api.setCounter('Sub State', 11)
            lootFragments();

            return timeout = 1;
        case 12:
            api.setCounter('Sub State', 12)
            sacrificeFragments();
            break;
        default:
            break;
    }
}

function soulWarsRoundAltDoloOne() {
    switch (subState) {
        case 0:
            api.setCounter('Sub State', 0)
            getPots();
            return timeout = 1;
        case 1:
            api.setCounter('Sub State', 1)
            getBandages();
            return timeout = 1;
        case 2:
            api.setCounter('Sub State', 2)
            moveToOutsideBarrier();

            return timeout = 2;
        case 3:
            api.setCounter('Sub State', 3)
            moveToGhostLocation();

            return timeout = 2;
        case 4:
            api.setCounter('Sub State', 4)
            obtainFragments();

            return timeout = 1;
        case 5:
            api.setCounter('Sub State', 5)
            moveToSceneLoadSpot();

            return timeout = 1;
        case 6:
            api.setCounter('Sub State', 6)
            moveToDieSpot();

            return timeout = 1;
        case 7:
            api.setCounter('Sub State', 7)
            lowerHealth();
            break;
        case 8:
            api.setCounter('Sub State', 8)
            moveToCornerOfLobby();
            return timeout = 2;
        case 9:
            api.setCounter('Sub State', 9)
            monitorAvatarHealth();

            return timeout = 8;
        case 10:
            api.setCounter('Sub State', 10)
            forfeitGame();
            break;
        default:
            break;
    }
}

function soulWarsRoundAltDoloTwo() {
    switch (subState) {
        case 0:
            api.setCounter('Sub State', 0)
            getPots();
            return timeout = 1;
        case 1:
            api.setCounter('Sub State', 1)
            getBandages();
            return timeout = 1;
        case 2:
            api.setCounter('Sub State', 2)
            moveToOutsideBarrier();

            return timeout = 2;
        case 3:
            api.setCounter('Sub State', 3)
            moveToGhostLocation();

            return timeout = 2;
        case 4:
            api.setCounter('Sub State', 4)
            obtainFragments();

            return timeout = 1;
        case 5:
            api.setCounter('Sub State', 5)
            moveToSceneLoadSpot();

            return timeout = 1;
        case 6:
            api.setCounter('Sub State', 6)
            moveToDieSpot();

            return timeout = 1;
        case 7:
            api.setCounter('Sub State', 7)
            lowerHealth();
            break;
        case 7:
            api.setCounter('Sub State', 7)
            attackMainIfTenHpAccount();
            break;
        case 8:
            api.setCounter('Sub State', 8)
            moveToCornerOfLobby();
            return timeout = 2;
        case 9:
            api.setCounter('Sub State', 9)
            monitorAvatarHealth();

            return timeout = 8;
        case 10:
            api.setCounter('Sub State', 10)
            forfeitGame();
            break;
        default:
            break;
    }
}

function soulWarsRoundMass() {
    switch (subState) {
        case 0:
            api.setCounter('Sub State', 0)
            return getPots();
        case 1:
            api.setCounter('Sub State', 1)
            return getBandages();
        case 2:
            api.setCounter('Sub State', 2)
            moveToOutsideBarrier();

            return timeout = 2;
        case 3:
            api.setCounter('Sub State', 3)
            return moveToGhostLocation();
        case 4:
            api.setCounter('Sub State', 4)
            determineMassRole();

            return timeout = 1;
        case 5:
            api.setCounter('Sub State', 5)
            return obtainFragments();
        case 6:
            api.setCounter('Sub State', 6)
            bandagePlayers();

            return timeout = 1;
        default:
            break;
    }
}

/* switch logic methods */

function resetSubState() {
    subState = 0;
}

function moveToRoundStartLoc() {
    if (isItemEquipped(fireStaff)) {
        api.interactInventoryWithIds([weaponID, 'Wield']);

        return timeout = 1;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    } else if (!isPlayerBusy()) {
        if (massWorld) {
            if (!isPlayerNearLocation(outsideMassBarrierStartLocation, 1)) {
                return api.webWalkStart(outsideMassBarrierStartLocation);
            } else if (isPlayerNearLocation(outsideMassBarrierStartLocation, 1)) {
                api.interactObject('Barrier', 'Pass');
                return subState++;
            }
        } else {
            if (!isPlayerNearLocation(outsideBarrierStartLocation, 2)) {
                return api.webWalkStart(outsideBarrierStartLocation);
            } else if (isPlayerNearLocation(outsideBarrierStartLocation, 2)) {
                api.interactObject('Barrier', 'Pass');
                return subState++;
            }
        }
    }

    // using the BM visual view to wait for the string 'To begin the game of Soul Wars`
}

function challengePlayer() {
    if (
        isPlayerNearLocation(new net.runelite.api.coords.WorldPoint(2274, 2919, 0), 10) ||
        isPlayerNearLocation(new net.runelite.api.coords.WorldPoint(2139, 2904, 0), 10)
    ) {
        return subState++;
    }

    if (massWorld) {
        return timeout = 2;
    }

    var lp = client.getLocalPlayer();
    var players = client.getPlayers();
    var opposingPlayerObj = findOpposingPlayer(players, opposingPlayerIGN);

    if (!opposingPlayerObj || !areBothPlayersInLobby(lp, opposingPlayerObj)) {
        return timeout = 3;
    }

    if (!hasChallengedPlayer) {
        client.menuAction(0, 0, net.runelite.api.MenuAction.PLAYER_FIRST_OPTION, opposingPlayerObj.getId(), -1, 'Challenge', opposingPlayerIGN);
        hasChallengedPlayer = true
    }

    return timeout = 3;
}

function beginGameRound() {
    mapTeamSpecificValues();
    stateHasReset = false;
    mainState++;

    return resetSubState();
}

function getPots() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (massWorld && bandagePlayersMethod) {
        return subState++;
    }

    if (!inventoryContains(potionOfPowerID)) {
        return api.interactObject('Potion of power table', 'Take-10');
    } else if (inventoryContains(potionOfPowerID)) {
        return subState++;
    }
}

function getBandages() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (doloMethodOne || (doloMethodTwo && altPlayer)) {
        subState++;
        return subState;
    }

    if (massWorld && bandagePlayersMethod && !inventoryContainsQuantity(bandageID, 20)) {
        return api.interactObject('Bandage table', 'Take-10');
    }

    if (!inventoryContains(bandageID)) {
        return api.interactObject('Bandage table', 'Take-5');
    } else if (inventoryContains(bandageID)) {
        return subState++;
    }
}

function moveToOutsideBarrier() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    api.interactObject('Barrier', 'Pass');

    return subState++;
}

function moveToGhostLocation() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (soul76) {
        if (!isPlayerNearLocation(sceneLoadLocation, 5)) {
            api.walkToTrueWorldPoint(sceneLoadLocation.getX(), sceneLoadLocation.getY());

            return timeout = 4;
        } else if (isPlayerNearLocation(sceneLoadLocation, 5)) {
            api.walkToTrueWorldPoint(ghostKillLocation.getX(), ghostKillLocation.getY());
            subState++;
            return timeout = 2;
        }
    }

    if (!isPlayerNearLocation(ghostKillLocation, 5)) {
        return api.walkToTrueWorldPoint(ghostKillLocation.getX(), ghostKillLocation.getY());
    } else if (isPlayerNearLocation(ghostKillLocation, 5)) {
        return subState++;
    }
}

function moveToGraveyardOneLocation() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(graveyardOneLocation, 1)) {
        return api.walkToTrueWorldPoint(graveyardOneLocation.getX(), graveyardOneLocation.getY());
    } else if (isPlayerNearLocation(graveyardOneLocation, 5)) {
        return subState++;
    }
}

function moveToObeliskLocation() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(capObeliskLocation, 1)) {
        return api.walkToTrueWorldPoint(capObeliskLocation.getX(), capObeliskLocation.getY());
    } else if (isPlayerNearLocation(capObeliskLocation, 5)) {
        return subState++;
    }
}

function moveToBridgeLocation() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(capObeliskLocation, 1)) {
        return api.walkToTrueWorldPoint(capObeliskLocation.getX(), capObeliskLocation.getY());
    } else if (isPlayerNearLocation(capObeliskLocation, 5)) {
        return subState++;
    }
}

function moveToGraveyardTwoLocation() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(graveyardTwoLocation, 1)) {
        return api.walkToTrueWorldPoint(graveyardTwoLocation.getX(), graveyardTwoLocation.getY());
    } else if (isPlayerNearLocation(graveyardTwoLocation, 5)) {
        return subState++;
    }
}

function obtainFragments() {
    if (isMoving()) {
        return timeout = 1;
    }

    if (hasEnoughFragments()) {
        shouldPray = false;
        subState++;
        return subState;
    }

    if (shouldSipPotion()) {
        sipPotion();
        return timeout = 1;
    }

    if (startLootFragments) {
        if (bot.tileItems.getItemsWithIds([soulFragmentID]).length <= 0) {
            startLootFragments = false;
        }

        bot.tileItems.lootItemsWithIds([soulFragmentID], 20);

        return timeout = 2;
    }

    if (!massWorld) {
        var fragmentFloorItems = 0;
        var fragmentsOnFloor = bot.tileItems.getItemsWithIds([soulFragmentID]);
        fragmentsOnFloor.forEach((item) => {
            fragmentFloorItems += item.item.getQuantity();
        });

        api.setCounter('Fragments Needed', fragmentAmount - fragmentFloorItems);
        if (fragmentFloorItems >= ( fragmentAmount / 2)) {
            startLootFragments = true;
            return timeout = 1;
        }
    }

    shouldPray = true;

    if (client.getLocalPlayer().getInteracting() != null) {
        return timeout = 1;
    }

    var npcs = client.getNpcs();
    var targettingGhosts = [];
    var closestNpc = null;
    var closestDistanceSquared = Number.MAX_VALUE;
    var localPlayer = client.getLocalPlayer();
    var localPlayerLocation = localPlayer.getWorldLocation();

    for (var j = 0; j < npcs.length; j++) {
        var npc = npcs[j];
        var npcName = npc.getName();
        var distanceSquared = Math.pow(npc.getWorldLocation().distanceTo(localPlayerLocation), 2);

        if (npc.isDead()) {
            ghostsToKillDynamic--;
            return timeout = 1;
        }

        if (npcName.includes('Forgotten') && npc.getInteracting() === localPlayer && !npc.isDead()) {
            targettingGhosts.push(npc);
        }

        if (npcName.includes('Forgotten') && distanceSquared < closestDistanceSquared && !npc.getInteracting() && !npc.isDead()) {
            closestNpc = npc;
            closestDistanceSquared = distanceSquared;
        }
    }
    if (targettingGhosts.length > 0) {
        api.interactSuppliedNpc(targettingGhosts[0], 'Attack');
    } else if (closestNpc) {
        api.interactSuppliedNpc(closestNpc, 'Attack');
    } else {
        api.interactNpc('Forgotten Soul', 'Attack');
    }

    return timeout = 4;
}

function moveToSceneLoadSpot() {
    if (isMoving()) {
        return timeout = 1;
    }

    if (soul76) {
        return subState++;
    }

    if (!isPlayerNearLocation(sceneLoadLocation, 2)) {
        return api.walkToTrueWorldPoint(sceneLoadLocation.getX(), sceneLoadLocation.getY());
    } else if (isPlayerNearLocation(sceneLoadLocation, 2)) {
        return subState++;
    }
}

function moveToAltKillSpot() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(mainKillTileLocation, 1)) {
        return api.walkToTrueWorldPoint(mainKillTileLocation.getX(), mainKillTileLocation.getY());
    } else if (isPlayerNearLocation(mainKillTileLocation, 1)) {
        return subState++;
    }
}

function moveToDieSpot() {
    if (isPlayerNearLocation(altDeathTileLocation, 1)) {
        return subState++;
    }

    if (client.getBoostedSkillLevel(net.runelite.api.Skill.HITPOINTS) > 1) {
        if (inventoryContains(locatorOrb)) {
            api.interactInventoryWithIds([locatorOrb], ['Feel'])
        } else if (inventoryContains(rockCake)) {
            api.interactInventoryWithIds([rockCake], ['Guzzle'])
        } else {
            api.PrintDebugMessage('[Warn] - No locator orb or rockcake found. Unable to lower health')
        }
    }

    if (isMoving()) {
        return timeout = 1;
    }

    shouldPray = false;

    if (!isPlayerNearLocation(altDeathTileLocation, 1)) {
        return api.walkToTrueWorldPoint(altDeathTileLocation.getX(), altDeathTileLocation.getY());
    };
}

function killAlt() {
    if (playerDeath) {
        timeout = 2;
        shouldPray = false;
        return subState++;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    var alt;

    var players = client.getPlayers();
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player != null && player.getName() == opposingPlayerIGN) {
            alt = player;
            break;
        }
    }

    shouldPray = true;

    //logic to wait for the alt to reach the designated kill zone
    if (alt) {
        if (!isAltInDeathArea(alt)) {
            return timeout = 1;
        } else {
            return api.attackPlayer([opposingPlayerIGN]);
        }
    }
}

function killAltIfNot10hpAccount() {
    if (playerDeath || tenHpAccount ) {
        timeout = 2;
        shouldPray = false;
        return subState++;
    }

    var tileItems = bot.tileItems.getItemsWithIds([soulFragmentID]);
    if (tileItems.length > 0) {
        tileItems.forEach((item) => {
            if (item.item.getOwnership() == 1) {
                return subState++;
            }
       });
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    var alt;
    var players = client.getPlayers();
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player != null && player.getName() == opposingPlayerIGN) {
            alt = player;
            break;
        }
    }

    if (alt) {
        if (!isPlayerNearPlayer(client.getLocalPlayer(), alt)) {
            return timeout = 1;
        } else {
            if (hasBoneDagger(client.getLocalPlayer()) && enableSpecialAttack()) {
                api.PrintDebugMessage('@@@@@@@@@@@@@@@@@@')
                api.interactSpecifiedWidget(10485795, 1, 57, -1);
                return timeout = 1;
            }

            shouldPray = true;

            return api.attackPlayer([opposingPlayerIGN]);
        }
    }
}

function lootFragments() {
    if (inventoryContains(soulFragmentID)) {
        subState++;
        return subState;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    return api.lootItemsWithIds([soulFragmentID], 5);
}

/*
    This was tricky to get the menuAction code to work for Telekinetic Grab.
    It seems that the p0 & p1 change depending on the tile being used to tg from.
    This requires manual mapping of the exact tile where the alt will die on to ensure
    successful tging of the fragments
*/
function telegrabFragments() {
    if (gameRoundColor === 0) { //red --> blue
        if (menuActionState === 0) {
            client.menuAction(-1, 14286875, net.runelite.api.MenuAction.WIDGET_TARGET, 0, -1, 'Cast', 'Telekinetic Grab');
            client.menuAction(-1, 14286875, net.runelite.api.MenuAction.WIDGET_TARGET, 0, -1, 'Cast', 'Telekinetic Grab');
            menuActionState++;

            return timeout = 2;
        } else if (menuActionState === 1) {
            client.menuAction(11, 77, net.runelite.api.MenuAction.WIDGET_TARGET_ON_GROUND_ITEM, 25201, -1, 'Cast', 'Telekinetic Grab');

            menuActionState++;
            return timeout = 2;
        }
    } else if (gameRoundColor === 1) { //blue --> red
        if (menuActionState === 0) {
            client.menuAction(-1, 14286875, net.runelite.api.MenuAction.WIDGET_TARGET, 0, -1, 'Cast', 'Telekinetic Grab');
            menuActionState++;

            return timeout = 1;
        } else if (menuActionState === 1) {
            client.menuAction(53, 46, net.runelite.api.MenuAction.WIDGET_TARGET_ON_GROUND_ITEM, 25201, -1, 'Cast', 'Telekinetic Grab');

            menuActionState++;
            return timeout = 2;
        }
    }

    if (numberOfFragments() > previousFragmentAmount) {
        return subState++;
    } else {
        menuActionState = 0;

        return timeout = 2;
    }
}

function captureObelisk() {
    //obeliskCaptured is handled via the onChatMessage() hook
    if (obeliskCaptured) {
        return subState++;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(capObeliskLocation, 1)) {
        return api.walkToTrueWorldPoint(capObeliskLocation.getX(), capObeliskLocation.getY());
    }

    return timeout = 1;
}

function captureGraveyardOne() {
    //captureGraveyardOne is handled via the onChatMessage() hook
    if (graveyardOneCaptured) {
        return subState++;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(graveyardOneLocation, 1)) {
        return api.walkToTrueWorldPoint(graveyardOneLocation.getX(), graveyardOneLocation.getY());
    }

    return timeout = 1;
}

function moveToBridgeTileLocationOne() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(bridgeTileLocationOne, 1)) {
        return api.walkToTrueWorldPoint(bridgeTileLocationOne.getX(), bridgeTileLocationOne.getY());
    } else if (isPlayerNearLocation(bridgeTileLocationOne, 1)) {
        return subState++;
    }
}

function moveToBridgeTileLocationTwo() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(bridgeTileLocationTwo, 1)) {
        return api.walkToTrueWorldPoint(bridgeTileLocationTwo.getX(), bridgeTileLocationTwo.getY());
    } else if (isPlayerNearLocation(bridgeTileLocationTwo, 1)) {
        return subState++;
    }
}

function captureGraveyardTwo() {
    //captureGraveyardTwo is handled via the onChatMessage() hook
    if (graveyardTwoCaptured) {
        return subState++;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(graveyardTwoLocation, 1)) {
        return api.walkToTrueWorldPoint(graveyardTwoLocation.getX(), graveyardTwoLocation.getY());
    }

    return timeout = 1;
}

function sacrificeFragments() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (handedInFragments) {
        return subState++;
    }

    if (obeliskCaptured) {
        api.interactObject('Soul Obelisk', 'Sacrifice-fragments');
    }

    return timeout = 1;
}

function moveToEnemyAvatarPathOne() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(checkpointAvatarLocationOne, 4)) {
        return api.walkToTrueWorldPoint(checkpointAvatarLocationOne.getX(), checkpointAvatarLocationOne.getY());
    } else if (isPlayerNearLocation(checkpointAvatarLocationOne, 1)) {
        return subState++;
    }
}

function moveToEnemyAvatarPathTwo() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(checkpointAvatarLocationTwo, 4)) {
        return api.walkToTrueWorldPoint(checkpointAvatarLocationTwo.getX(), checkpointAvatarLocationTwo.getY());
    } else if (isPlayerNearLocation(checkpointAvatarLocationTwo, 1)) {
        return subState++;
    }
}

function moveToEnemyAvatarPathThree() {
    shouldPray = true;

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(enemyAvatarLocation, 4)) {
        return api.walkToTrueWorldPoint(enemyAvatarLocation.getX(), enemyAvatarLocation.getY());
    } else if (isPlayerNearLocation(enemyAvatarLocation, 1)) {
        return subState++;
    }
}

function fightAvatar() {
    shouldPray = true;

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    api.interactNpc('Avatar', 'Attack');
}

function lowerHealth() {
    if (client.isPrayerActive(net.runelite.api.Prayer.PROTECT_FROM_MELEE)) {
        togglePrayers();
    }

    if (client.getBoostedSkillLevel(net.runelite.api.Skill.HITPOINTS) > 1) {
        if (inventoryContains(locatorOrb)) {
            api.interactInventoryWithIds([locatorOrb], ['Feel'])
        } else if (inventoryContains(rockCake)) {
            api.interactInventoryWithIds([rockCake], ['Guzzle'])
        } else {
            api.PrintDebugMessage('[Warn] - No locator orb or rockcake found. Unable to lower health')
        }
    }

    if (isInRespawnArea(client.getLocalPlayer())) {
        return subState++;
    }
}

function attackMainIfTenHpAccount() {
    if (isInRespawnArea(client.getLocalPlayer())) {
        return subState++;
    }

    if (!isItemEquipped(fireStaff)) {
        api.interactInventoryWithIds([fireStaff], 'Wield');

        return timeout = 1;
    }

    var main;

    var players = client.getPlayers();
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player != null && player.getName() == opposingPlayerIGN) {
            main = player;
            break;
        }
    }

    return api.attackPlayer([opposingPlayerIGN]);
}

function moveToCornerOfLobby() {
    if (doloMethodTwo) {
        subState++;
        return timeout = 4;
    }

    if (isPlayerBusy()) {
        return timeout = 1;
    }

    if (!isPlayerNearLocation(lobbyCornerLocation, 1)) {
        return api.walkToTrueWorldPoint(lobbyCornerLocation.getX(), lobbyCornerLocation.getY());
    } else if (isPlayerNearLocation(lobbyCornerLocation, 1)) {
        subState++
        return timeout = 4;
    }

}

function monitorAvatarHealth() {
    if (damageDealtOnAvatar >= damageToDeal) {

        timeout = 4;
        return subState++;
    }
}

function forfeitGame() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    api.interactObject('Portal', 'Leave');

    return timeout = 6;
}

/* helper methods */

function isWebWalking() {
    return api.isWebWalking();
}

function isMoving() {
    return api.localPlayerMoving();
}

function isPlayerAnimating() {
    return client.getLocalPlayer() != null && client.getLocalPlayer().getAnimation() != -1;
}

function isPlayerIdle() {
    return api.localPlayerIdle();
}

function isPlayerBusy() {
    return (isWebWalking() || isMoving() || isPlayerAnimating() || !isPlayerIdle());
}

function isItemEquipped(id) {
    var eqp = client.getItemContainer(94);

    if (eqp != null) {
        if (eqp.contains(id)) {
            return true;
        }
    }

    return false
}

function isPlayerNearLocation(targetLocation, minDistance) {
    return distanceFromWorldPoint(client.getLocalPlayer(), targetLocation) <= minDistance
}

function distanceFromWorldPoint(lp, wp) {
    var playerWorldPoint = getTrueWorldPoint(lp.getWorldLocation());

    var distance = wp.distanceTo(playerWorldPoint);

    return distance;
}

function inventoryContains(id) {
    var inv = client.getItemContainer(93);
    if (inv != null) {

        if (inv.contains(id)) {
            return true;
        }
    }
    return false
}

function inventoryContainsQuantity(id, amount) {
    var inv = client.getItemContainer(93);
    var count = 0;

    if (inv != null) {
        for (var i = 0; i < 28; i++) {
            var item = inv.getItem(i);

            if (item != null) {
                if (item.getId() == id) {
                    count++;
                }
            }

            if (count >= amount) {
                return true;
            }
        }
        if (count >= amount) {
            return true;
        }
    }
    return count >= amount;
}

function getTrueWorldPoint(wp) {
    let localPoint = new net.runelite.api.coords.LocalPoint.fromWorld(client, wp)
    return net.runelite.api.coords.WorldPoint.fromLocalInstance(client, localPoint);
}

function hasEnoughFragments() {
    var inventory = client.getItemContainer(93);
    var soulFragmentID = 25201;

    if (massWorld) {
        return false;
    }

    if (inventory != null) {
        var items = inventory.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item != null && item.getId() == soulFragmentID) {
                previousFragmentAmount = item.getQuantity();

                return item.getQuantity() >= fragmentAmount;
            }
        }
    }

    return false;
}

function numberOfFragments() {
    var inventory = client.getItemContainer(93);
    var soulFragmentID = 25201;

    if (inventory != null) {
        var items = inventory.getItems();
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item != null && item.getId() == soulFragmentID) {
                return item.getQuantity();
            }
        }
    }

    return 0;
}

function onActorDeath(actor) {
    if (actor.getName() == opposingPlayerIGN) {
        playerDeath = true;
    }
}

function onChatMessage(type, name, message) {
    // handles obelisk capture logic
    if (message.includes('has taken control of the Soul Obelisk')) {
        obeliskCaptured = true;
    }

    // handles graveyardOne capture logic
    if (gameRoundColor == 0 && message.includes('eastern graveyard')) {
        graveyardOneCaptured = true;
    }

    if (gameRoundColor === 1 && message.includes('western graveyard')) {
        graveyardOneCaptured = true;
    }

    if (gameRoundColor === 0 && message.includes('western graveyard')) {
        graveyardTwoCaptured = true;
    }

    if (gameRoundColor === 1 && message.includes('eastern graveyard')) {
        graveyardTwoCaptured = true;
    }

    // handles graveyardTwo capture logic
    if (message.includes('has taken control of the Soul Obelisk')) {
        obeliskCaptured = true;
    }

    // handles fragment deposit logic
    if (message.includes('You charge the Soul Obelisk with soul fragments and weaken')) {
        handedInFragments = true;
    }
}

function onHitsplatApplied(actor, hitsplat) {
    if (actor.getName().includes('Avatar')) {
        damageDealtOnAvatar = damageDealtOnAvatar + hitsplat.getAmount();
        api.setCounter('Avatar Damage Dealt', damageDealtOnAvatar);
    }
}

function togglePrayers() {
    if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) >= 43) {
        api.togglePrayer(net.runelite.api.Prayer.PROTECT_FROM_MELEE, true);
    }

    if (styleMage) {
        if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) >= 77 && client.getVarbitValue(5452) == 1) {
            api.togglePrayer(net.runelite.api.Prayer.AUGURY, true);
        } else if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) >= 45) {
            api.togglePrayer(net.runelite.api.Prayer.MYSTIC_MIGHT, true);
        }
    }

    if (styleRange) {
        if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) >= 74 && client.getVarbitValue(5451) == 1) {
            api.togglePrayer(net.runelite.api.Prayer.RIGOUR, true);
        } else if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) >= 44) {
            api.togglePrayer(net.runelite.api.Prayer.EAGLE_EYE, true);
        }
    }

    if (styleMelee) {
        if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) >= 70 && client.getVarbitValue(3909) == 8) {
            api.togglePrayer(net.runelite.api.Prayer.PIETY, true);
        } else if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) >= 34) {
            api.togglePrayer(net.runelite.api.Prayer.ULTIMATE_STRENGTH, true);
            api.togglePrayer(net.runelite.api.Prayer.INCREDIBLE_REFLEXES, true);
        }
    }
}

function containsAnyRestorePot() {
    for (var i = 0; i < restorePots.length; i++) {
        if (inventoryContains(restorePots[i])) {
            return true;
        }
    }
    return false;
}

function shouldSipPotion() {
    if (!containsAnyRestorePot()) {
        return false;
    }

    if (client.getBoostedSkillLevel(net.runelite.api.Skill.RANGED) <= client.getRealSkillLevel(net.runelite.api.Skill.RANGED)) {
        return true;
    }

    if (client.getBoostedSkillLevel(net.runelite.api.Skill.PRAYER) <= Math.floor(Math.random() * (10 - 5 + 1)) + 5) {
        return true;
    }

    return false;
}

function shouldRestorePrayer() {
    //safeguard for accounts below the minimum prayer threshold
    if (client.getRealSkillLevel(net.runelite.api.Skill.PRAYER) < 43) {
        return false;
    }

    if (client.getBoostedSkillLevel(net.runelite.api.Skill.PRAYER) <= Math.floor(Math.random() * (20 - 15 + 1)) + 15) {
        return true;
    }

    return false;
}

function sipPotion() {
    api.interactInventoryWithNames(['Potion of power'], ['Drink']);
}

function shouldUseBandage() {
    if (client.getEnergy() <= 15) {
        return true;
    }

    if (massWorld && client.getBoostedSkillLevel(net.runelite.api.Skill.HITPOINTS) <= 9) {
        return true;
    }
}

function useBandage() {
    api.interactInventoryWithNames(['Bandages'], ['Heal']);
}

function findOpposingPlayer(players, opposingPlayerIGN) {
    var opposingPlayerObj = null;

    players.forEach((player) => {
        if (player != null && player.getName() == opposingPlayerIGN) {
            opposingPlayerObj = player;
        }
    });

    return opposingPlayerObj;
}

function resetStates() {
    mainState = 0;
    subState = 0;
    timeout = 0;
    menuActionState = 0;
    damageDealtOnAvatar = 0;
    hasPassedBarrier = false;
    hasChallengedPlayer = false;
    isPlayerLooting = false;
    enableLootingLogic = false;
    playerDeath = false;
    obeliskCaptured = false;
    graveyardOneCaptured = false;
    graveyardTwoCaptured = false;
    handedInFragments = false;
    shouldPray = false;
    startLootFragments = false;
    ghostsToKillDynamic = ghostsToKillStatic;
    api.setCounter('Avatar Damage Dealt', 0);
    api.setCounter('Fragments Needed', fragmentAmount);
    api.setCounter('Zeal Gained', client.getVarpValue(2871) - startAtZeal)
}

/* Area Definitions */

//Main world lobby to setup game
var swLobby = [{
        x: 2220,
        y: 2846
    },
    {
        x: 2220,
        y: 2838
    },
    {
        x: 2229,
        y: 2838
    },
    {
        x: 2229,
        y: 2846
    }
];

//Mass world lobby to setup game
var massWorldLobby = [{
        x: 2199,
        y: 2846
    },
    {
        x: 2199,
        y: 2838
    },
    {
        x: 2189,
        y: 2838
    },
    {
        x: 2189,
        y: 2846
    }
];

//Main world spawn area after a game has finished
var swIslandGraveyardArea = [{
        x: 2217,
        y: 2855
    },
    {
        x: 2217,
        y: 2844
    },
    {
        x: 2202,
        y: 2844
    },
    {
        x: 2202,
        y: 2855
    }
];

//Area the red alt goes to die
var redDeathArea = [{
        x: 2194,
        y: 2924
    },
    {
        x: 2194,
        y: 2926
    },
    {
        x: 2196,
        y: 2926
    },
    {
        x: 2196,
        y: 2924
    }
];

//Area the blue alt goes to die
var blueDeathArea = [{
        x: 2222,
        y: 2903
    },
    {
        x: 2222,
        y: 2901
    },
    {
        x: 2220,
        y: 2901
    },
    {
        x: 2220,
        y: 2903
    }
];

//Lobby area in-game where the red alt respawns after death
var redRespawnArea = [{
        x: 2271,
        y: 2914
    },
    {
        x: 2271,
        y: 2924
    },
    {
        x: 2278,
        y: 2924
    },
    {
        x: 2278,
        y: 2914
    }
];

//Lobby area in-game where the blue alt respawns after death
var blueRespawnArea = [{
        x: 2136,
        y: 2900
    },
    {
        x: 2136,
        y: 2910
    },
    {
        x: 2143,
        y: 2910
    },
    {
        x: 2143,
        y: 2900
    }
];

function areBothPlayersInLobby(lp, opposingPlayer) {
    var lpLocation = lp.getWorldLocation();
    var opposingPlayerLocation = opposingPlayer.getWorldLocation();

    var lpInLobby = isInsideofArea(swLobby, lpLocation.getX(), lpLocation.getY());
    var opposingPlayerInLobby = isInsideofArea(swLobby, opposingPlayerLocation.getX(), opposingPlayerLocation.getY());

    return lpInLobby && opposingPlayerInLobby;
}

function isAltInDeathArea(opposingPlayer) {
    var opposingPlayerLocation = getTrueWorldPoint(opposingPlayer.getWorldLocation());

    return isInsideofArea(altDeathArea, opposingPlayerLocation.getX(), opposingPlayerLocation.getY());
}

function isPlayerNearLocation(targetLocation, minDistance) {
    return distanceFromWorldPoint(client.getLocalPlayer(), targetLocation) <= minDistance
}

function isInResetArea(player) {
    return isInsideofArea(swIslandGraveyardArea, player.getWorldLocation().getX(), player.getWorldLocation().getY());
}

function isInRespawnArea(player) {
    var playerRealLoc = getTrueWorldPoint(player.getWorldLocation());

    return isInsideofArea(respawnArea, playerRealLoc.getX(), playerRealLoc.getY());
}

function isInsideofArea(area, px, py) {
    var inside = false;
    for (var i = 0, j = area.length - 1; i < area.length; j = i++) {
        var xi = area[i].x,
            yi = area[i].y;
        var xj = area[j].x,
            yj = area[j].y;

        var intersect = ((yi > py) != (yj > py)) &&
            (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

/* Mass world logic */

function determineMassRole() {
    if (bandagePlayersMethod) {
        subState = 6;
    } else {
        subState++;
    }

    return subState;
}

function bandagePlayers() {
    if (isPlayerBusy()) {
        return timeout = 1;
    }

    let players = client.getPlayers();
    let playerToBandage = null;

    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (player === null) continue;

        var playerEquipment = player.getPlayerComposition().getEquipmentIds();

        if (gameRoundColor === 0 && playerEquipment.includes(redTeamCloak)) {
            if (playerNeedsBandaging(player)) {
                playerToBandage = player;
                break;
            }
        } else if (gameRoundColor === 1 && playerEquipment.includes(blueTeamCloak)) {
            if (playerNeedsBandaging(player)) {
                playerToBandage = player;
                break;
            }
        }
    }

    if (playerToBandage) {
        api.itemOnPlayer(['bandageID'], [playerToBandage.getName()])

        return timeout = 16;
    }
}

function playerNeedsBandaging(player) {
    var currentHealth = player.getHealthRatio() * player.getHealthScale();
    var maxHealth = player.getHealthScale();

    return currentHealth < maxHealth;
}

function isPlayerNearPlayer(player1, player2) {
    var player1WorldLocation = getTrueWorldPoint(player1.getWorldLocation());
    var player2WorldLocation = getTrueWorldPoint(player2.getWorldLocation());

    return player1WorldLocation.distanceTo(player2WorldLocation) <= 2;
}

function hasBoneDagger(player) {
    var playerComp = player.getPlayerComposition()
    if (!playerComp) {
        return false;
    }

    var equipmentIDs = playerComp.getEquipmentIds();
    if (!equipmentIDs) {
        return false;
    }

    //add 512 to the dagger id cause jagex
    api.PrintDebugMessage('[DEBUG] hasBoneDagger(): ' + equipmentIDs.includes(9384))

    return equipmentIDs.includes(9384);
}

function hasOneHitpoint(player) {
    var healthRatio = player.getHealthRatio();
    var healthScale = player.getHealthScale();
    
    var currentHealth = Math.ceil((healthRatio / 30) * healthScale);

    api.PrintDebugMessage('[DEBUG] hasOneHitpoint(): ' + currentHealth)
    
    return currentHealth === 1;
}

function enableSpecialAttack() {
    var specialAttackOrbState = client.getVarpValue(301);

    api.PrintDebugMessage('[DEBUG] enableSpecialAttack(): ' + specialAttackOrbState)
    
    if (specialAttackOrbState === 0) {
        return true;
    } else {
        return false;
    }
}

// TODO - unequip gear on booster alt when moving to center
// const EquipmentInventorySlot = {
//     WEAPON: 3,
//     SHIELD: 5,
//     GLOVES: 9,
// };

// function checkWeaponSlot() {
//     const weaponID = checkSlot(EquipmentInventorySlot.WEAPON);
//     if (weaponID !== -1) {
//         api.setVariable("StoredWeaponID", weaponID);
//         return true;
//     }
//     return false;
// }

// function checkShieldSlot() {
//     const shieldID = checkSlot(EquipmentInventorySlot.SHIELD);
//     if (shieldID !== -1) {
//         api.setVariable("StoredShieldID", shieldID);
//         return true;
//     }
//     return false;
// }

// function checkGlovesSlot() {
//     const glovesID = checkSlot(EquipmentInventorySlot.GLOVES);
//     if (glovesID !== -1) {
//         api.setVariable("StoredGlovesID", glovesID);
//         return true;
//     }
//     return false;
// }

// function checkSlot(slotIndex) {
//     var equipment = client.getItemContainer(94);

//     if (equipment != null) {
//         var slots = equipment.getItems();
//         const item = slots[slotIndex];
//         if (item && item.getId() !== -1) {
//             return item.getId();
//         }
//     }
//     return -1;
// }